import  { Schema, Mongoose} from "mongoose"

const mongoose = new Mongoose();

mongoose.connect("mongodb+srv://sukeshp:x21qkXQYjY5XbopS@cluster0-lxsof.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });

const unitSchema: Schema = new Schema({
    _id: String,
    engineNo: {type: String, required: true},
    model: {type: String, required: true},
    color: {type: String, required: true},
    entryDate: {type: Date, required: true},
    saleDate: {type: Date, required: false},
    saleType: {type: String, enum: ["Counter", "Network"], required: false},
    transactionType: {typr: String, enum: ["Cash", "Finance"]},
    checkpoint: {type: String, required: () => this.soldType === "Network"},
    financeName: {type: String, required: () => (this.soldType === "Counter" && this.transactionType == "Finance")},
});

export default mongoose.model('Unit', unitSchema);

