import { NextApiRequest, NextApiResponse } from 'next'
import { setParams } from '../../utils/params'

export default async function getOneInchQuote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = new URL('https://api.1inch.dev/swap/v5.2/1/quote')

  setParams(url, req.query)

  try {
    const apiRes = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`,
        accept: 'application/json',
      },
    })

    const responseBody = await apiRes.text()

    if (!apiRes.ok) {
      console.error('Error from 1inch API:', responseBody)
      // Return the 1inch API status code and its response body
      return res.status(apiRes.status).json({
        error: `1inch API error: ${responseBody || 'Unknown error'}`,
      })
    }

    if (responseBody.trim() === '') {
      throw new Error('Empty response from 1inch API')
    }

    const data = JSON.parse(responseBody)

    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error || 'Failed to fetch quote from 1inch' })
  }
}

// export default async function getOneInchQuote(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const url = new URL('https://api.1inch.dev/swap/v5.2/1/quote')

//   setParams(url, req.query)

//   try {
//     const apiRes = await fetch(url.href, {
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`,
//         accept: 'application/json',
//       },
//     })

//     const responseBody = await apiRes.text()

//     if (!apiRes.ok) {
//       console.error('Error from 1inch API:', responseBody)
//       throw new Error(`1inch API responded with status ${apiRes.status}`)
//     }

//     if (responseBody.trim() === '') {
//       throw new Error('Empty response from 1inch API')
//     }

//     const data = JSON.parse(responseBody)

//     res.status(200).json(data)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'Failed to fetch quote from 1inch' })
//   }
// }

// export default async function getOneInchQuote(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const url = new URL('https://api.1inch.dev/swap/v5.2/1/quote')

//   setParams(url, req.query)

//   try {
//     const apiRes = await fetch(url.href, {
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`,
//         accept: 'application/json',
//       },
//     })

//     if (!apiRes.ok) {
//       throw new Error(`1inch API responded with status ${apiRes.status}`)
//     }

//     const data = await apiRes.json()

//     res.status(apiRes.status).json(data)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'Failed to fetch quote from 1inch' })
//   }
// }
