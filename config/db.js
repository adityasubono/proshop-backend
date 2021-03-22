const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('MongoDB Terhubung ...')
    } catch (err) {
        console.log('MongoDB Gagal Terhubung ...')
        console.log(err.message);
        // Proses akan berhenti jika koneksi tidak tersambung
        process.exit(1);
    }
}

module.exports = connectDB;
