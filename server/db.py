from functools import partial

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

async def db_create_tables(connection):
    await create_table(connection, orders)
    await create_table(connection, order_lines)
    await create_table(connection, stocks)

async def db_insert_order(connection, order):
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
        return True
    return False

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
                                          'quantity': product['quantity']}))
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
    stocks_by_product = [dict(r) for r in stocks_by_product]
    return stocks_by_product

async def db_select_pending_orders(connection):
    pending_orders = await connection.execute(orders
                                               .select()
                                               .where(orders.c.finished == False)) # NOQA
    results = []
    for r in pending_orders:
        r = dict(r)
        lines = await connection.execute(select([order_lines.c.product, order_lines.c.quantity])
                                         .where(order_lines.c.order_id == r['id']))
        r['products'] = [dict(l) for l in lines]
        results.append(r)
    return results
