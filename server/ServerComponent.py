from autobahn.asyncio.wamp import ApplicationSession
from autobahn.asyncio.wamp import ApplicationRunner
from aiopg.sa import create_engine

from db import db_insert_order
from db import db_finish_order
from db import db_modify_stock
from db import db_select_stock
from db import db_create_tables
from db import db_select_pending_orders

try:
    from local_settings import DB_USER, DB_NAME
except ImportError:
    DB_USER = "fosdem"
    DB_NAME = "fosdem"


class ServerComponent(ApplicationSession):
    async def order_create(self, order):
        async with self.engine.acquire() as connection:
            if await db_insert_order(connection, order):
                print("Created order", order)
                await self._publish_order(order)

    async def order_finish(self, order):
        async with self.engine.acquire() as connection:
            if (await db_finish_order(connection, order) and
               await db_modify_stock(connection, order)):
                print("Finished order", order)
                order['finished'] = True
                await self._publish_order(order)
                await self._publish_stock()

    async def stock_initial(self):
        async with self.engine.acquire() as connection:
            stocks_by_product = await db_select_stock(connection)
        print("Initial stock", stocks_by_product)
        return stocks_by_product

    async def orders_pending_initial(self):
        async with self.engine.acquire() as connection:
            pending_orders = await db_select_pending_orders(connection)
        print("Initial orders", pending_orders)
        return pending_orders

    async def onJoin(self, details):
        await self.register(self.order_create, u'order.create')
        await self.register(self.order_finish, u'order.finish')
        await self.register(self.stock_initial, u'stock.initial')
        await self.register(self.orders_pending_initial, u'orders.pending.initial')
        self.engine = await create_engine(user=DB_USER,
                                          database=DB_NAME)
        async with self.engine.acquire() as connection:
            await db_create_tables(connection)

    async def _publish_stock(self):
        async with self.engine.acquire() as connection:
            stocks_by_product = await db_select_stock(connection)
        print("Publishing stock: {}".format(stocks_by_product))
        self.publish(u'stock.onchange', stocks_by_product)

    async def _publish_order(self, order):
        print("Publishing order: {}".format(order))
        self.publish(u'orders.onchange', order)


runner = ApplicationRunner(url=u"ws://localhost:8080/ws", realm=u"realm1")
runner.run(ServerComponent)
