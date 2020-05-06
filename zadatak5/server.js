const http=require('http')
const url=require('url')
const fs=require('fs')
const qs=require('querystring')
let artikli=JSON.parse(fs.readFileSync("artikli.json"))


http.createServer(function (request,response){
    let urlObj=url.parse(request.url,true,true)

    switch (request.method)
    {
        case "GET":
            switch (urlObj.pathname)
            {
                case "/":
                    fs.readFile("./index.html", function (err,data){
                        if (err){
                            return;
                        }
                        response.end(data);
                    });
                    break;
                case "/sviartikli":
                    let imeKomp=urlObj.query.imeKomp
                    response.end(JSON.stringify(sviArtikli(imeKomp)))
                    break;
                
                default:
                    response.end("Pogresna putanja!")
                    break;
            }    
            break;
        case "POST":
            switch (urlObj.pathname)
            {
                case "/kreirajNovu":

                    var body='';
                    request.on('data', function (data) {
                        body +=data;
                    });
                    request.on('end',function(){
                        var qry = qs.parse(body);
                        if(dodajArtikal(qry.id,qry.naziv,qry.cena,qry.imeKomp))
                            response.end(JSON.stringify({"poruka":"Uspesno dodavanje!"}))
                        else
                            response.end(JSON.stringify({"poruka":"Neuspesno dodavanje, postoji ID!"}))
                    });
                    break;

                    case "/obrisi":
                        var body='';
                        request.on('data', function (data) {
                            body +=data;
                        });
                        request.on('end',function(){
                            var qry = qs.parse(body);
                            if(obrisiArtikal(qry.id)==true)
                                response.end(JSON.stringify({"poruka":"Uspesno izbrisan artikal!"}))
                            else
                                response.end(JSON.stringify({"poruka":"Neuspesno iizbrisan artikal, nema zadati ID!"}))
                        });
                    break;
                    case "/postaviArtikal":
                        var body='';
                        request.on('data', function (data) {
                            body +=data;
                        });
                        request.on('end',function(){
                            var qry = qs.parse(body);
                            if(postaviArtikal(qry.id,qry.naziv,qry.cena,qry.imeKomp)==true)
                                response.end(JSON.stringify({"poruka":"Uspesna izmena!"}))
                            else
                                response.end(JSON.stringify({"poruka":"Neuspesna izmena, nema zadati id!"}))
                        });

                        break;
                default:
                    response.end("Pogresna putanja!")
                    break;
            }   
            break;
        default:
            response.end("Pogresan metod! (GET | POST)")
            break;
    }
}).listen(5000);


function sviArtikli(imeKomp) {
    if(imeKomp=="")
        return artikli;
    else
        return artikli.filter(x=>x.imeKomp==imeKomp)
}

function dodajArtikal(id, naziv, cena, imeKomp) {
    if(getArtikal(id)!=undefined)
        return false
    artikli.push({"id":parseInt(id),"naziv":naziv,"cena":parseInt(cena), "imeKomp":imeKomp})
    return true
}

function getArtikal(id) {
    return artikli.find(x=>x.id==id)
}

function postaviArtikal(id, naziv, cena, imeKomp) {
    if(getArtikal(id)==undefined)
        return false
    artikli=artikli.map(x=>{
        if(x.id==id)
           { x.naziv=naziv
            x.cena=parseInt(cena)
            x.imeKomp=imeKomp}
        return x})
    return true
}

function obrisiArtikal(id) {
    if(getArtikal(id)==undefined)
        return false
    artikli.splice(artikli.findIndex(x=>x.id==id),1)
    return true
}
