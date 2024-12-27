import { Webhook } from "svix"
import userModel from "../models/userModel.js";

const clerkWebHooks = async (req, res) => {
    
    try {
        // create an svix instance with clerk webhook secret
        const hook = new Webhook(process.env.WEBHOOK_SECRET);

        await hook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    photo: data.image_url,
                    fname: data.first_name,
                    lname: data.last_name,
                };

                await userModel.create(userData);
                res.json({});
                break;
            }
            case "user.updated": {
                // these 4 can be updated, not clerkId
                const userData = {
                    email: data.email_addresses[0].email_address,
                    photo: data.image_url,
                    fname: data.first_name,
                    lname: data.last_name,
                };

                await userModel.findOneAndUpdate({clerkId:data.id}, userData);
                res.json({});

                break;
            }
            case "user.deleted": {

                await userModel.findByIdAndDelete({clerkId:data.id});
                res.json({});

                break;
            }  
        
            default:
                break;
        }


    } catch (error) {
        console.log(error.message);
        res.json({ success:false, message:error.message });
    }

};

export {clerkWebHooks};