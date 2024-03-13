const axios = require("axios")

module.exports={
    Add:async (req,res)=>{
        const url = "https://developers.flouci.com/api/generate_payment"
        const payload = {
            "app_token": "29f6690c-7f65-48c5-8ff0-084fbc45bb14", 
            "app_secret": process.env.PRIVATE_JETON,
            "amount": req.body.amount,
            "accept_card": "true",
            "session_timeout_secs": 1200,
            "success_link": "http://localhost:5173/success",
            "fail_link": "http://localhost:5173/failure",
            "developer_tracking_id": "e8d95249-f41c-4eb9-9c19-7508091470b6"
        }
       await axios.post(url,payload).then(result=>{
        res.send(result.data)
       })
       .catch(err=>console.log(err))
    },
    Verify:async(req,res)=>{
        const id_payment=req.params.id
        await axios.get(`https://developers.flouci.com/api/verify_payment/${id_payment}`,{
            headers:{
                'Content-Type': 'application/json' ,
                'apppublic': '29f6690c-7f65-48c5-8ff0-084fbc45bb14' ,
                'appsecret': process.env.PRIVATE_JETON
            }
        }).then((result)=>res.send(result.data)).catch((e)=>console.log(e))
    }
}