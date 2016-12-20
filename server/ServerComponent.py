from functools import partial

from autobahn.asyncio.wamp import ApplicationSession
from autobahn.asyncio.wamp import ApplicationRunner
from aiopg.sa import create_engine
from psycopg2 import ProgrammingError
import sqlalchemy as sa

from sqlalchemy_dump import dump_sql


metadata = sa.MetaData()
orders = sa.Table('orders',
                  metadata,
                  sa.Column('id', sa.Integer, primary_key=True),
                  sa.Column('product', sa.String(255)),
                  sa.Column('quantity', sa.Integer))

stocks = sa.Table('stocks',
                  metadata,
                  sa.Column('id', sa.Integer, primary_key=True),
                  sa.Column('product', sa.String(255)),
                  sa.Column('quantity', sa.Integer))

async def create_table(conn, table):
    try:
        await conn.execute(dump_sql(partial(table.create, checkfirst=True))())
    except ProgrammingError:  # table already exists
        pass


class ServerComponent(ApplicationSession):
    async def onOrderCreate(self, order):
        self.publish(u'order.oncreate', order)
        print(order)

    async def onOrderOk(self, order):
        self.publish(u'order.onok', order)
        print(order)

    async def onStockChange(self, changes):
        self.publish(u'stock.onchange', changes)
        print(changes)

    async def onJoin(self, details):
        print("session ready")
        await self.register(self.onOrderCreate, u'order.create')
        await self.register(self.onOrderOk, u'order.ok')
        await self.register(self.onStockChange, u'stock.change')
        async with create_engine(user='fosdem',
                                 database='fosdem') as engine:
            async with engine.acquire() as conn:
                await create_table(conn, orders)
                await create_table(conn, stocks)


runner = ApplicationRunner(url=u"ws://localhost:8080/ws", realm=u"realm1")
runner.run(ServerComponent)
