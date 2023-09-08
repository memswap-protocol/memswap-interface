import { Address } from 'viem'

export const chainDefaultCollections: Record<number, Address[]> = {
  1: [
    '0x76be3b62873462d2142405439777e971754e8e77', // parallel alpha
    '0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258', // otherdeed for otherside
    '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', // doodles
    '0xd774557b647330c91bf44cfeab205095f7e6c367', // nakamigos
    '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7', // meebits
    '0x4e1f41613c9084fdb9e34e11fae9412427480e56', // terraforms
  ],
  5: [
    '0x393d91f6884a3985c9ad7332fa517b3e3ce05f5e', // azuki
    '0xd0754605d9840ba5a54fa1a82f29850c2e1a1bdd', // bored ape
    '0x05fdbac96c17026c71681150aa44cbd0dddd3374', // clonex
    '0x06f36c3f77973317bea50363a0f66646bced7319', // moonbird
    '0x0d884092ca2d377529511b744cf1c550e46b0f99', // milady
    '0xbdcf4b6693e344115b951c4796e8622a66cdb728', // coolcats
  ],
}
