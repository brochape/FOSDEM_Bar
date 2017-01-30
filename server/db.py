from functools import partial

from psycopg2 import ProgrammingError
import sqlalchemy as sa
from sqlalchemy.sql import func, select

from sqlalchemy_dump import dump_sql


metadata = sa.MetaData()
orders = sa.Table('orders',
                  metadata,
                  sa.Column('id', sa.Integer, primary_key=True),
                  sa.Column('bar', sa.String(255)),
                  sa.Column('product', sa.String(255)),
                  sa.Column('quantity', sa.Integer),
                  sa.Column('finished', sa.Boolean, default=False))

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

async def db_create_tables(connection):
    await create_table(connection, orders)
    await create_table(connection, stocks)

async def db_insert_order(connection, order):
    result = await connection.execute(orders.insert()
                                            .values(order)
                                            .returning())
    first = await result.first()
    order['id'] = first[0]
    return True

async def db_finish_order(connection, order):
    if await connection.execute(orders
                                .update()
                                .where(orders.c.id == order['id'])
                                .values(finished=True)):
        return True
    return False

async def db_modify_stock(connection, order):
    for product in order['products']:
        await connection.execute(stocks
                                 .insert()
                                 .values({'product': product['product'],
                                          'quantity': -product['quantity']}))
    return True

async def db_select_stock(connection):
    stocks_by_product = await (connection
                               .execute(select([
                                               stocks.c.product,
                                               func
                                               .sum(stocks.c.quantity)
                                               .label("quantity")
                                               ])
                                        .group_by(stocks.c.product)))
    stocks_by_product = [dict(r) for r in stocks_by_product if r['quantity'] > 0]
    return stocks_by_product

async def db_select_pending_orders(connection):
    pending_orders = await connection.execute(orders
                                               .select()
                                               .where(orders.c.finished == False)) # NOQA
    results = [dict(l) for l in pending_orders]
    return results
