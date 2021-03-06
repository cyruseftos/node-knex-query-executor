import path from 'path'
import spawn from 'cross-spawn'

test('Typescript', () => {
    const typescriptCompilation = spawn.sync('./node_modules/.bin/tsc', [
        '-p',
        path.resolve(__dirname, './type-safety-fixtures/testconfig.json')
    ])

    const output = typescriptCompilation.stdout.toString()

    expect(output).toMatchSnapshot('Typescript expected failures')
})
