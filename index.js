


const {
    default: makeWASocket,
	MessageType, 
    MessageOptions, 
    Mimetype,
	DisconnectReason,
    useSingleFileAuthState
} =require("@adiwajshing/baileys");

const { Boom } =require("@hapi/boom");
const {state, saveState} = useSingleFileAuthState("./auth_info.json");
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose')

const express = require("express");
const bodyParser = require("body-parser");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const axios = require("axios");
const port = process.env.PORT || 8000;


const Category = require('./models/category')
const Channel = require('./models/channel_model')
const Product = require('./models/product_model')
const Subscriber = require('./models/subscription_model')
const Shop = require('./models/shop_model')
const User = require('./models/user')






mongoose.connect('mongodb+srv://whatsapp:wrkaxoBJXyJLHiPh@cluster0.ugwf8vf.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser : true})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.on('open', () =>console.log('connected to the database'))









//fungsi suara capital 
function capital(textSound){
    const arr = textSound.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str = arr.join(" ");
    return str;

}

async function connectToWhatsApp() {
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
         const phone = update.messages
    	console.log("Update",phone);
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp();
            }
        } else if(connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on("creds.update", saveState);








 const getlocation = async (msg,Sender)=>{

            const Hnum = msg
            //the host number or channel number
            const Chan = getChan(Hnum)
            console.log("Channel",Chan)
        
             //query the database for location of the channel

            const cat_section = await Channel.findOne({phone_number: Chan})
                   .exec()
                   .then(response =>{
                    console.log("response:",response)
                    return response.location
                   })

                //console.log("location array",cat_section)
            const bu_bo = cat_section.map(cat=>{
                     return  {
                      buttonId: cat._id,
                      buttonText:{displayText: cat.name },type:1}
                   })
    
            const buttonInfo = {
                        text: "Welcome dear customer, we are glad",
                        buttons: bu_bo,
                        headerType: 1,
                        viewOnce:true
                    }
                            
            await sock.sendMessage(Sender, buttonInfo);

}



        function getChan(Non){
             console.log("Non",Non)
              const zero = "0"
              const Host = Non.split(':')[0]
              console.log("first part",Host)
              const sp = Host.substr(-9)
             console.log("second part",sp)
              const fine = zero.concat(sp)
              console.log("final",fine)

          return fine
        }

        function getChan2(Non){
             console.log("Non",Non)
              const zero = "0"
              const Host = Non.split('@')[0]
              console.log("first part",Host)
              const sp = Host.substr(-9)
             console.log("second part",sp)
              const fine = zero.concat(sp)
              console.log("final",fine)

          return fine
        }

                
        function getHostNumber(){

            try{
                const data = ()=> fs.readFileSync('auth_info.json',{encoding: 'utf8'})
                const Jdata = JSON.parse(data())
                const PhonNum = Jdata.creds.me.id
                const JPh = getChan(PhonNum)
              //  console.log("poooooo:",JPh)
                return JPh
            }catch(err){
                console.log(err)
            }
               

      }


//get shops

     const getShops = async (responseId,Num, Sender)=>{

         try{
              const loc = responseId
              console.log("category",loc)
              const Chan = Num
              console.log("Host:",Chan)
              const V_shops = await Subscriber.find({"channel_no": Chan, "location":loc,"verified":true})
              .exec()
              .then(response=>{
                
                return response
              })
            console.log("V_shopso",V_shops)
            console.log("length:", V_shops.length)
                if(V_shops.length < 1){
                    await sock.sendMessage(Sender, {text:'we couldnt find shops in that location. Did you know that you can be the first to create a shop in that location? Contact us now to know how..'});

                }else {

              const list=[]
              for (let item of V_shops){
                const Id = item.sub_shop_id
                let details = await Shop.findOne({_id:Id})
                .exec()
                .then(response=>{
                  
                  list.push(response)
                 
                })



                  }
                   console.log("list:",list)

                  //console.log("Details:",list)

                  const rows = list.map(itr=>{
                   return{ 
                    title:itr.name,
                     rowId: itr._id
                   }

                  })

              console.log("Rows:",rows)



              const jenismenu = [{
                            title : 'MAKANAN', 
                            rows :rows
                    }]

                    const listReply = {
                        text: "Menu",
                        title: "QAvailable Shops",
                        buttonText: "click to open",
                        sections : jenismenu,
                        viewOnce: true
                    }
                    
                    await sock.sendMessage(Sender, listReply);
                }

         }catch(err){
            console.log("errrrr:",err)
                    await sock.sendMessage(Sender, {text: "Sorry we couldnt find shops in that location\n By the way, did you know that you can also create and list products to reach your customers via our platform! Send us a message now on 0742202619 to know more."})                        
                    }             


}


//get shop banner

            
const getShopBanner = async (responseId,Sender)=>{


    const Id = responseId
    console.log(Id)
   

    const Shopa = await Shop.findOne({_id:Id }).exec()
    .then(response=>{
      return response
    })
    console.log("Shopa", Shopa)


    
    // const co = "./public"
    // const img = co.concat(Shopa.imgUrl)
    const img = Shopa.imgUrl
    
    console.log("img", img)
    

   /* #######################################################################################
                          Send buttons in the baileys library
                          there has to be an image on the buttons. dont forget that
    ##########################################################################################
   */


                 

                const buttonInfo = {
                        image: { url: img},
                        caption: "Business card",
                        footer:"",
                       //text:"hello there",
                        buttons: [{ buttonId: Id,buttonText:{displayText: "View Products" },type:1}],
                        headerType: 4,
                        viewOnce:true
                        
                    }
                            
            await sock.sendMessage(Sender,buttonInfo);


}

//get products from a shop

const getProducts = async (responseId,Num,Sender)=>{
              try{
              const S_id = responseId
              console.log(S_id)
              
              const V_products = await Product.find({shop: S_id},{_id: 1,product_name:1,product_description:1})
              .exec()
              .then(response=>{
                
                return response
              })

            console.log("Products:",V_products)

            if(V_products.length < 1) throw "wowo"
                const Num = getHostNumber();
              const rows = V_products.map(itr=>{
                   return{ 
                    title:itr.product_name,
                     rowId: itr._id
                   }

              })

            

                const jenismenu = [{
                            title : '💵💵Products💵💵', 
                            rows :rows
                    }]

                    const listReply = {
                        text: "Check out our amazing products",
                        title: "Available Products",
                        buttonText: "click to open",
                        sections : jenismenu,
                        viewOnce: true
                    }
                    
                    await sock.sendMessage(Sender, listReply);


    }catch(err){
        console.log("errrrrrororrr:",err)
        await sock.sendMessage(Sender,{text:"sorry,we couldnt find products in that shop. By the way, did you know that you can also create list products and reach your customers via our platform! Send us a message now on 0742202619 to know more."})
      
    }






   }




//get product banner

            const getProductBanner = async (responseId,Sender)=>{


              //function to get the pproduct banner and send it to the user as a button.

                const Id = responseId
                
                const pra = await Product.findOne({_id:Id }).exec()
                .then(response=>{
                  return response
                })
               //sso = "./public"
                const img = pra.image_url
                //const media = await MessageMedia.fromFilePath(img);
               // await client.sendMessage(msg.from, media);
                

               /* #######################################################################################
                                      Send buttons in the baileys library
                                      there has to be an image on the buttons. dont forget that
                ##########################################################################################
               */


                                    const buttonInfo = {
                                    image: { url: img},
                                    caption: "product image",
                                    footer:"",
                                    buttons: [{ buttonId: Id,buttonText:{displayText: "Order Product" },type:1}],
                                    headerType: 4,
                                    viewOnce:true
                                    
                                }
                                        
                        await sock.sendMessage(Sender,buttonInfo);

            }


//get product order.

                const getProductOrder = async (responseId,Sender)=>{

    try{

      const S_id = responseId
              console.log(S_id)
              
              const V_owner = await Product.findOne({_id: S_id},{owner:1,product_name:1})
              .exec()
              .then(response=>{
                
                return response
              })
              const email = V_owner.owner
              const ProdName = V_owner.product_name
              console.log("email addrss:", email)

              const OwnerContact = await User.findOne({email_address: email},{Whatsapp_number:1})
              .exec()
              .then(response=>{
                return response.Whatsapp_number
              })

            console.log("Owner of the product:",V_owner)
             console.log("Owner of the product:",OwnerContact)


             try{
              const Numb = ConcNum(OwnerContact)

              const Orderer = getChan2(Sender)
              console.log("Oderer:", Orderer)
              const CustOrder = `New Order Recevied:\n Item:${ProdName} \n Customer:${Orderer}\n Please contact them to complete the deal`
              await sock.sendMessage(Numb,{text:CustOrder});
              await sock.sendMessage(Sender,{text:`Thank you for placing your order via our platform.\n The Owner of the shop will contact you shortly to arrange your delivery.\n Once again we appreciate you.\n Here is your order.\n ********Order details*********\n   item: ${ProdName}`});
              


             }catch(err){
                console.log(err.message)
                    await sock.sendMessage(Sender,{text: "Sorry we couldnt send your order to the shop owner."});

                   


             }





    }catch(err){
      console.log(err.message)

      await sock.sendMessage(Sender,{text: "sorry,we are having trouble contacting \n the owner of the product right now."});
    }







}

                function ConcNum(Non){
                      const last = "@s.whatsapp.net"
                      const first ="256"

                      const inter = first.concat(Non.substr(-9))

                      const finalNumber = inter.concat(last)
                      console.log(finalNumber)
                      return finalNumber
                    }

































    sock.ev.on("messages.upsert", async ({messages,type}) => {
        console.log(messages)

            const InitM = messages[0].message.conversation;
            const responseList = messages[0].message.listResponseMessage;
            const responseButton = messages[0].message.buttonsResponseMessage;
            console.log("response::::",responseButton)
            const Sender = messages[0].key.remoteJid;
            const MfromMe = messages[0].key.fromMe
            const Typeo = type


            /* ##############################################################33
                Ignore the messages from and waitf or messages from the other number
             ####################################################################
            // */
            if(!MfromMe){

                //check whether it is a buy initiation
                if(Typeo ==="notify" && InitM === "Buy!!"){
                    //check for locations and send the buttons

                    const Num = getHostNumber()
                    console.log("get channel",Num)
                    getlocation(Num,Sender);

                    
                }
                else if(responseButton !=null){
                    const responseId = responseButton.selectedButtonId

                    //check for the buttons
                    console.log("button response:",responseId)
                    if(responseId.startsWith("l")){
                          console.log("l detected")

                          //get shops in that location specified
                          const Num = getHostNumber()
                          //getCategories()
                          getShops(responseId,Num,Sender)

                        }else if(responseId.startsWith("S")){
                          console.log("S detected")
                          //get products in the shop specified
                          const Num = getHostNumber()
                          getProducts(responseId,Num,Sender)

                        }else if(responseId.startsWith("P")){
                          console.log("P detected")
                          //specifies the order on product.
                          //send the order to the owner of the shop
                          getProductOrder(responseId,Sender)

                        }

             }



                //wait for the list response
            else if(responseList !=null){
                const responseId = responseList.singleSelectReply.selectedRowId

                console.log(responseId)

                    //check for the different list options

                    if(responseId.startsWith("S")){
                      console.log("list rsponse with S")

                      //send the shop details in a button to the owner
                      getShopBanner(responseId,Sender)



                    }else if(responseId.startsWith("P")){
                      //get products details and send them to the useras a button
                      console.log("list response with P")

                      getProductBanner(responseId,Sender)


                    }

              }

            }
        

        })

    }



 
// run in main file
connectToWhatsApp()
.catch (err => console.log("unexpected error: " + err) ) // catch any errors

server.listen(port, () => {
  console.log("Server running on Port : " + port);
});
