import {createRoutes, getSubdomain, routesWithValue} from 'lib/url'

it('should return the correct subdomain', () => {
  expect(getSubdomain('sage.obv.io')).toBe('sage')
  expect(getSubdomain('foobar')).toBe('')
  expect(getSubdomain('obv.io')).toBe('')
  expect(getSubdomain('foo.sage.obv.io')).toBe('sage')
  expect(getSubdomain('foo.bar.baz.sage.obv.io')).toBe('sage')
  expect(getSubdomain('app.staging.obv.io')).toBe('app')
})

it('should namespace routes', () => {
  const routes = createRoutes({
    foo: '/foo',
    bar: {
      baz: '/baz',
      quex: {
        quz: '/quz',
        grand_child: {
          great_grand_child: '/great_grand_child',
        },
      },
    },
  })

  expect(routes.root).toBe('/')
  expect(routes.foo).toBe('/foo')
  expect(routes.bar.root).toBe('/bar')
  expect(routes.bar.baz).toBe('/bar/baz')
  expect(routes.bar.quex.root).toBe('/bar/quex')
  expect(routes.bar.quex.quz).toBe('/bar/quex/quz')
  expect(routes.bar.quex.grand_child.great_grand_child).toBe(
    '/bar/quex/grand_child/great_grand_child',
  )
  expect(routes.bar.quex.grand_child.root).toBe('/bar/quex/grand_child')
})

it('should replace route params', () => {
  expect(
    routesWithValue(':bar', 'baz', {
      foo: ':bar',
    }),
  ).toMatchObject({
    foo: 'baz',
  })

  // Nested
  expect(
    routesWithValue(':bar', 'baz', {
      foo: ':bar/baz',
      quex: {
        kwe: '/bar/foo/:bar',
        test: {
          bar: 'foo',
          fizz: {
            buzz: '/boo/:bar/bam',
          },
        },
      },
    }),
  ).toMatchObject({
    foo: 'baz/baz',
    quex: {
      kwe: '/bar/foo/baz',
      test: {
        bar: 'foo',
        fizz: {
          buzz: '/boo/baz/bam',
        },
      },
    },
  })
})
