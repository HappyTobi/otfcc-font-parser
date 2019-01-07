const fs = require("fs");
const file_content = fs.readFileSync("emoji.json");
const jsonContent = JSON.parse(file_content);

const dot_split_char = '.';
const underscore_split_char = '_';
const com_split_char = ',';

console.log("1️⃣".codePointAt(0));

const content_ignore = [ 'uE007F' ]
const colors = {
    0: "",
    1: "🏻".codePointAt(0),
    2: "🏼".codePointAt(0),
    3: "🏽".codePointAt(0),
    4: "🏾".codePointAt(0),
    5: "🏿".codePointAt(0),
    "M": "♂".codePointAt(0),
    "W": "♀️".codePointAt(0)
};

//console.log("\uD83C\uDFFF".codePointAt(0));
//console.log(String.fromCodePoint(0x261D) + String.fromCodePoint(127999));
/*
copied from https://stackoverflow.com/questions/2440700/reordering-arrays
*/
Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };

function handleUnicode(glyph, cb) {
    //glyph.forEach()
    //TODO sortieren farbe muss immer an 2te stelle
    //let sorted = glyph.splice(0);
    return cb(glyph.flatMap((gl, index, array) => {
        if(gl.startsWith("u")) {
            gl = "0x" + gl.substring(1);
            return gl;
        } else {
            var tg = colors[gl];
            if(tg !== undefined) {
                return tg;
            } else {
                /* MB , MBX */
                if (gl.length > 1) {
                    return "";
                } else {
                    return "0x" + gl;
                }            
            }
        }
    }));
};

var filter_json_content = jsonContent.glyph_order.filter(glyph => 
    { 
        if(glyph.startsWith("u") 
            && glyph.startsWith("uni") === false 
            && content_ignore.includes(glyph) === false) 
        {
            return glyph;
        } else {
            console.log(`skip glyph ${glyph}`);
        }
    }).map(fglyph => {   
        let sglyph = fglyph.split(underscore_split_char).join(com_split_char).split(dot_split_char).join(com_split_char).split(com_split_char);
                
        if(sglyph.length == 1) {
            handleUnicode(sglyph, (csglyph) => {
                console.log(`icon: ${String.fromCodePoint(csglyph)}`);
            });
        } else if(sglyph.length == 2) {
            handleUnicode(sglyph, (csglyph) => {
                console.log(`icon: ${String.fromCodePoint(csglyph[0]) + String.fromCodePoint(csglyph[1])}`);
            });
        } else if(sglyph.length > 2) {
            handleUnicode(sglyph, (csglyph) => {
                console.log(`cl ${csglyph}`);
                console.log(`icon: ${String.fromCodePoint(csglyph[0]) + String.fromCodePoint(csglyph[1]) + String.fromCodePoint(csglyph[2])}`);
            });
        }
    });
