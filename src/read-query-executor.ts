import * as Knex from 'knex'
import { QueryExecutor, TableNames } from '.'
import { UnitOfWorkQueryExecutor } from './unit-of-work-query-executor'

export class ReadQueryExecutor<
    TTableNames extends string,
    Services extends object
> extends QueryExecutor<TTableNames, Services> {
    kind!: 'read-query-executor'

    constructor(
        knex: Knex,
        services: Services,
        tableNames: TableNames<TTableNames>
    ) {
        super('read-query-executor', knex, services, tableNames)
    }

    /**
     * Executes some work inside a transaction
     * @param work a callback which contains the unit to be executed
     * The transaction will be commited if promise resolves, rolled back if rejected
     * @example executor.unitOfWork(unit => unit.executeQuery(insertBlah, blah))
     */
    unitOfWork<T>(
        work: (
            executor: UnitOfWorkQueryExecutor<TTableNames, Services>
        ) => Promise<T>
    ): PromiseLike<any> {
        return this.knex.transaction(trx => {
            // knex is aware of promises, and will automatically commit
            // or reject based on this callback promise
            return work(
                new UnitOfWorkQueryExecutor(trx, this.services, this.tableNames)
            )
        })
    }
}
