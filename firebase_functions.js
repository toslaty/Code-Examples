//firestore update entry for every customer

exports.db_update_zoom_xpress2 = functions
	.region('europe-west1')
	.runWith({ memory: '128MB', timeoutSeconds: 60 })
	.https.onRequest(async (req,res) => {

	async function allItemsResult(limit) { 
		const db = admin.firestore()
		const itemsCollection = db.collection("users")
		let allItemsResult1 = await itemsCollection.limit(limit).get()
		return allItemsResult1
	}
	async function commiting(batch){
		await batch.commit()
		console.log('Committed')
	}
	try{
		const db = admin.firestore()
		const limit = 200
		var allItemsResult1 = await allItemsResult(limit)
		let read = allItemsResult1.docs.length
		console.log(read)
			
			while (read > 0) {
				const batch = db.batch()
				let updated = 0

				allItemsResult1.docs.forEach((queryResult) => {
				const doc = queryResult.data()
				if(doc.meetings){

				if (!doc.meetings.xpress2) {
					updated++
					batch.update(queryResult.ref, {
					meetings: {
						pberg: doc.meetings.pberg,
						xberg: doc.meetings.xberg,
						xpress: doc.meetings.xpress,
						xpress2:{
							join_url: 'A ZOOM URL',
						}
					}
					})
				}
				}
				})
				await commiting(batch)
				console.log(`Updated ${updated} of ${read} items!`)
				const lastVisible = allItemsResult1.docs[read - 1]
				console.log('lastVisib', lastVisible)
				allItemsResult1 = await admin.firestore().collection("users").startAfter(lastVisible).limit(limit).get()	
				console.log('Item reassign', allItemsResult1)
				read = allItemsResult1.docs.length
			}
		return res.status(200).send('SUCCESS')
		}catch(error){
			console.log(error)
			return res.status(500).send(error)
		}
	})

// A Voucher Purchase via Stripe

exports.create_checkout_session_voucher = functions
	.region('europe-west1')
	.runWith({memory: '128MB', timeoutSeconds: 60})
	.https.onRequest(async (req, res) =>{
		cors(req,res, async() =>{
			try{
				const {priceId, successUrl,cancelUrl} = req.body

				const session = await stripe.checkout.sessions.create({
									mode: 'payment',
									line_items: [
										{
											price: priceId,
											quantity: 1,
										},
									],
									customer_creation: 'always',
									success_url: successUrl,
									cancel_url: cancelUrl,
				})

				console.log(session)		
				return res.status(200).json({ sessionId: session.id })
			}
			catch(error){
				console.log(error)
				return res.status(500)
			}
		})
	})	

// Triggering a Mail via Firebase Functions

async function sendVoucher(code,email,name) {
	const voucher_code = code
	const mail = email

	await admin.firestore().collection('mail').add({
		to: `${mail}`,
		message: {
			subject: 'Your Gift Voucher for XXX',
		html: `<div>
		<img src='Source for picture' style="margin-bottom:2rem;"></img><br>
		<p style="font-weight:bold;text-decoration: underline;font-family: "Times New Roman", Times, serif;">Merry Christmas!</p><br>
		You received a gift-voucher for <a href="Domain>Domain</a>.<br>Your Gift Voucher has the following code: <strong>${voucher_code}<strong>
		</div>`,
		text: `Merry Christmas! Your Gift Voucher has the following code: ${voucher_code}`,
		},
	}).then(() => console.log('Queued email for delivery!'))

	return voucher_code;
}
