from functools import partial

from autobahn.asyncio.wamp import ApplicationSession
from autobahn.asyncio.wamp import ApplicationRunner
from aiopg.sa import create_engine
from psycopg2 import ProgrammingError
import sqlalchemy as sa
from sqlalchemy.sql import func, select

from sqlalchemy_dump import dump_sql


metadata = sa.MetaData()
orders = sa.Table('orders',
                  metadata,
                  sa.Column('id', sa.Integer, primary_key=True),
                  sa.Column('from', sa.String(255)),
                  sa.Column('finished', sa.Boolean, default=False))

order_lines = sa.Table('order_lines',
                       metadata,
                       sa.Column('id', sa.Integer, primary_key=True),
                       sa.Column('product', sa.String(255)),
                       sa.Column('quantity', sa.Integer),
                       sa.Column('order_id',
                                 sa.Integer,
                                 sa.ForeignKey('orders.id'),
                                 nullable=False))

stocks = sa.Table('stocks',
                  metadata,
                  sa.Column('id', sa.Integer, primary_key=True),
                  sa.Column('product', sa.String(255)),
                  sa.Column('quantity', sa.Integer))

async def create_table(conn, table):
    try:
        await conn.execute(dump_sql(partial(table.create, checkfirst=True))())
    except ProgrammingError:  # table already exists
        print("Table {} already exists".format(table))


class ServerComponent(ApplicationSession):
    async def order_create(self, order):
        async with self.engine.acquire() as connection:
            if len(order['products']) > 0:
                result = await connection.execute(orders.insert()
                                                        .values({
                                                            'from': order['from']
                                                        }).returning())
                first = await result.first()
                order['id'] = first[0]
                for product in order['products']:
                    product['order_id'] = order['id']
                    await connection.execute(order_lines.insert()
                                                        .values(**product)
                                                        .returning())
                    del product['order_id']
                del order['id']
                self.publish(u'order.oncreate', order)
                print("Created order", order)

    async def order_finish(self, order):
        async with self.engine.acquire() as connection:
            connection.execute(orders
                               .update()
                               .where(orders.c.id == order['id'])
                               .values(finished=True))
            self.publish(u'order.onfinish', order)
            print("Finished order", order)

    async def stock_change(self, changes):
        async with self.engine.acquire() as connection:
            connection.execute(stocks.insert().values(**changes))
        stocks_by_product = await self._get_stock()
        self.publish(u'stock.onchange', stocks_by_product)
        print("New stock", stocks_by_product)

    async def stock_initial(self):
        stocks_by_product = await self._get_stock()
        print("Initial stock", stocks_by_product)
        return stocks_by_product

    async def onJoin(self, details):
        await self.register(self.order_create, u'order.create')
        await self.register(self.order_finish, u'order.finish')
        await self.register(self.stock_change, u'stock.change')
        await self.register(self.stock_initial, u'stock_initial')
        self.engine = await create_engine(user='fosdem',
                                          database='fosdem')
        async with self.engine.acquire() as connection:
            await create_table(connection, orders)
            await create_table(connection, order_lines)
            await create_table(connection, stocks)

    async def _get_stock(self):
        print("get_stock")
        async with self.engine.acquire() as connection:
            stocks_by_product = await (connection
                                       .execute(select([
                                                       stocks.c.product,
                                                       func
                                                       .sum(stocks.c.quantity)
                                                       .label("total")
                                                       ])
                                                .group_by(stocks.c.product)))
            stocks_by_product = [dict(r) for r in stocks_by_product]
        return stocks_by_product

runner = ApplicationRunner(url=u"ws://localhost:8080/ws", realm=u"realm1")
runner.run(ServerComponent)
