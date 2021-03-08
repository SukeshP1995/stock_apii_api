import  { Schema, Mongoose} from "mongoose"

const mongoose = new Mongoose();

mongoose.connect("mongodb+srv://sukeshp:x21qkXQYjY5XbopS@cluster0-lxsof.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });

const accessorySchema: Schema = new Schema({
    model: String,
    halfKitItems: [{
        type: String
    }],
    fullKitItems: [{
        type: String
    }],
    halfKitHsn: String,
    fullKitHsn: String,
    halfKitPrice: Number,
    fullKitPrice: Number,
    halfKitQuantity: Number,
    fullKitQuantity: Number,
    accessories: [{
        name: String,
        hsn: String,
        quantity: Number,
        price: Number
    }]

});

export default mongoose.model('Accessory', accessorySchema);
