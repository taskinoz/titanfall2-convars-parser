// @ts-ignore
import * as fs from "fs";
// @ts-check

// Titanfall 2 Dumped Convars
export const url: string = "https://pastebin.com/raw/3DSCK09f";

// Download the file
export const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.text();
    return data;
};

// Convar structure
// Address - e.g 0x000002079BD1A830 - Pattern: 18 characters
// Space - e.g. " " - Pattern: 1 character
// Name - e.g. "+ability" - Pattern: contained in quotes
// Space - e.g. " " - Pattern: 1 character if value exists
// Value - e.g. "1" - Pattern: contained in quotes
// Space and hyphen - e.g. " - " - Pattern: one space, a hyphen, and another space
// Description - e.g. Enable ability - Pattern: Any characters including new lines untill the Closing address or nothing
// Closing address - e.g. 0x00000004 - Pattern: 10 characters

// example convar with all parts
// 0x00007FFDA86494E0 "ai_current_enemy_bonus" "15" - The AI's current enemy is given a bonus distance heuristic so that he is likely to pick them again 0x00000004

// example convar with no value
// 0x00007FFDC775CD80 "demos" - Demo demo file sequence. 0x00000000

// example convar with no description
// 0x000002079CCCCF40 "dof_enable" "1" -  0x00000008

// example convar with no value and no description
// 0x000002079BD18A90 "+break" -  0x00000008

export const parseConvars = async (data: string, type: 'csv'|'json' = 'csv') => {
  
  // Match each convar as an individual string
  var convars:any = data.match(/0x[0-9A-F]{16} ".*?"[ ".*?"]? - .*?0x[0-9A-F]{8}/gs);
  
  if(!convars) return console.log("No convars found");

  // Write the convars to a file
  var data = type === 'csv' ? "Address,Name,Value,Description,End Address\n" : [];
  convars.forEach(convar => {   
    var address = convar.match(/0x[0-9A-F]{16}/)[0];
    // Match the first set of quotes
    var name = convar.match(/"(.*?)"(?=\s*-\s*)/g)?.[0];
    var value = convar.match(/"(.*?)"(?=\s*-\s*)/g)?.[1];
    if(!value) value = "";
    var endAddress = convar.match(/0x[0-9A-F]{8}$/)[0];
    var description = `"${convar.match(/- (.*?)0x[a-fA-F0-9]{8}/gs)[0]}"`;
    description = description.slice(3, description.length-12);
    if (type === 'json') {
      data.push({
        address: address,
        name: name.replace(/"/g, ''),
        value: value.replace(/"/g, ''),
        description: description,
        end_adress:endAddress,
      });
    }
    else {
      data += `${address},${name},${value},${description},${endAddress}\n`;
    }
  });
  
  return type === 'json' ? JSON.stringify(data, null, 2) : data;

}

const dumpConvars = async () => {
  const format = 'json';
  const data = await getFile(url);
  const convars:any = await parseConvars(data, format);
  fs.writeFileSync("convars."+format, convars);
}

dumpConvars();