import sqlalchemy
from functools import wraps
from io import StringIO


def dump_sql(func, bind=False):
    @wraps(func)
    def func_wrapper(*args, **kwargs):
        out = StringIO()

        def dump(sql, *multiparams, **params):
            out.write('{};\n'.format(str(sql.compile(dialect=dump.dialect))
                                     .strip()))

        engine = sqlalchemy.create_engine('postgres://',
                                          strategy='mock',
                                          executor=dump)
        dump.dialect = engine.dialect

        if bind:
            func(*args, bind=engine, **kwargs)
        else:
            func(engine, *args, **kwargs)

        return out.getvalue()
    return func_wrapper


def create_all_sql(metadata):
    return dump_sql(metadata.create_all, bind=True)()


def drop_all_sql(metadata):
    return dump_sql(metadata.drop_all, bind=True)()
