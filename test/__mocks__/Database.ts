import { IDatabase } from "../../src/Database";
import { Result, Session } from "neo4j-driver";

export class DatabaseMock implements IDatabase {
  getSession(): Session { return { } as Session }
  async close(): Promise<void> { return }

  constructor(mocks: unknown = { }) {
    this.getSession = jest.fn().mockReturnValue({
      run: mocks["runMock"] ?? jest.fn().mockResolvedValue({ records: [] }),
      beginTransaction: undefined,
      lastBookmark: undefined,
      readTransaction: undefined,
      writeTransaction: undefined,
      close: mocks["closeMock"] ?? jest.fn()
    });
  }
}

export function mockResult(rows: unknown[]): Result {
  return <Result><unknown> {
    records: rows.map(row => ({
      keys: Object.keys(row),
      // eslint-disable-next-line no-prototype-builtins
      get: (key: string) => row.hasOwnProperty(key) ? row[key] : null
    }))
  }
}
