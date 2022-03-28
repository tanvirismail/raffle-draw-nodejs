import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import result from './result.json';

const port = 3000;
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');

const startSL = 1;
const endSL = 5000;
const prizeCount = 10;
const length = result.lock.length;

app.get('/', (req, res) => {
    let status = '';
    if(length == prizeCount){
        status = 'complete';
    }
    res.render('index',{status: status})
});

app.post('/store', (req, res) => {

    if(length < prizeCount){
        let rndInt = '';
        do {
            rndInt = Math.floor(Math.random() * endSL) + startSL
        } while (result.lock.indexOf(rndInt) > 0 && length < prizeCount);
        result.lock.push(rndInt);
        const content = JSON.stringify(result);
        fs.writeFile('./result.json', content, err => {
            if (err) {
                console.error(err)
                return
            }
        })
        res.json({status:'success',result:rndInt});
    } 
    else {
        res.json({status:'complete',result: result.lock});
    }
    
});

app.get('/data', (req, res) => {
    res.json({result:'sdf'})
    // res.sendFile(path.join(__dirname, './views/index.html')));
});

app.listen(port, () => console.log(`Server started on PORT ${port}`));
