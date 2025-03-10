import { deserialize, DocumentObject } from '../src'
import { CaseType } from '../src/types'

describe('deserialize', () => {
  it('deserialize relationships included and not included', () => {
    const serialized: DocumentObject = {
      data: [
        {
          type: 'users',
          id: '1',
          attributes: {
            'first-name': 'Joe',
            'last-name': 'Doe',
          },
          relationships: {
            address: {
              data: {
                type: 'addr',
                id: '1',
              },
            },
            images: {
              data: [
                { type: 'img', id: '1' },
                { type: 'img', id: '2' },
              ],
            },
          },
        },
      ],
      included: [
        {
          type: 'addr',
          id: '1',
          attributes: {
            street: 'Street 1',
          },
        },
      ],
    }

    expect(deserialize(serialized, { changeCase: CaseType.camelCase })).toEqual([
      {
        id: '1',
        firstName: 'Joe',
        lastName: 'Doe',
        address: {
          id: '1',
          street: 'Street 1',
        },
        images: [{ id: '1' }, { id: '2' }],
      },
    ])
  })

  it('deserialize includes links', () => {
    const serialized: DocumentObject = {
      data: [
        {
          type: 'users',
          id: '1',
          attributes: {
            'first-name': 'Joe',
            'last-name': 'Doe',
          },
          links: {
            self: 'https://example.org/users/1',
          },
          relationships: {
            address: {
              data: {
                type: 'addr',
                id: '1',
              },
              links: {
                self: 'https://example.org/address/1/relationships/address',
                related: 'https://example.org/users/1/address',
              },
            },
            images: {
              data: [
                { type: 'img', id: '1' },
                { type: 'img', id: '2' },
              ],
            },
          },
        },
      ],
      included: [
        {
          type: 'addr',
          id: '1',
          attributes: {
            street: 'Street 1',
          },
        },
      ],
    }

    expect(deserialize(serialized, { changeCase: CaseType.camelCase })).toEqual([
      {
        id: '1',
        firstName: 'Joe',
        lastName: 'Doe',
        links: {
          self: 'https://example.org/users/1',
        },
        address: {
          id: '1',
          street: 'Street 1',
          links: {
            self: 'https://example.org/address/1/relationships/address',
            related: 'https://example.org/users/1/address',
          },
        },
        images: [{ id: '1' }, { id: '2' }],
      },
    ])
  })
})
