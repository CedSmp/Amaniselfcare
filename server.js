require('dotenv').config()

const express = require("express")
const app = express()
app.use(express.json())
app.use(express.static("public"))

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const storeItems = new Map([
  [1, { priceInCents: 300, name: "Sel de bain"}],
  [2, { priceInCents: 300, name: "Bougie neutre" }],
  [3, { priceInCents: 500, name: "Bouie senteur fleur de cerisier" }],
  [4, { priceInCents: 700, name: "Savon au miel" }],
  [5, { priceInCents: 800, name: "Savon à la rose" }],
  [6, { priceInCents: 2500, name: "Parfum Aïsha" }],
  [7, { priceInCents: 2500, name: "Parfum Rouge" }],
  [8, { priceInCents: 3500, name: "Box complète" }],
])

app.post('/create-checkout-session',async (req, res) => {
  try {
     const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {allowed_countries: ['BE']},
        custom_text:{
            shipping_address: {
              message: 'Nous proposons majoritairement des vents en Belgique mais si vous venez d\'un autre Pays, contactez-nous. Lien pour trouver le point relai le plus proche : https://www.mondialrelay.be/fr-be/trouver-le-point-relais-le-plus-proche-de-chez-moi/',
            },
        },
        shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {amount: 500, currency: 'eur'},
                display_name: 'Livraison à domicile',
                delivery_estimate: {
                  minimum: {unit: 'business_day', value: 3},
                  maximum: {unit: 'business_day', value: 3},
                },
              },
            },
            {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: {amount: 375, currency: 'eur'},
                  display_name: 'Livraison en point relai',
                  delivery_estimate: {
                    minimum: {unit: 'business_day', value: 3},
                    maximum: {unit: 'business_day', value: 3},
                  },
                },
              },
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: {amount: 0, currency: 'eur'},
                  display_name: 'Réserver pour la vente du 18 mars au Woluwe shopping',
                  delivery_estimate: {
                  },
                },
              },
          ],
        
      payment_method_types: ['card','bancontact'],
      mode: 'payment',
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
            price_data :{
                currency: 'eur',
                product_data: {
                    name: storeItem.name,
                },
                unit_amount: storeItem.priceInCents,
               },
             quantity: item.quantity,
        }
      }),
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/index.html`
     })
      res.json({ url : session.url })
  } catch (e) {
   res.status(500).json({ error: e.message })
  } 
})

app.listen(2006)