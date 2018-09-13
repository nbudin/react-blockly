/**
 * @param {string} xml
 */
export default function parseWorkspaceXml(xml) {
  const arrayTags = ['name', 'custom', 'colour','categories', 'blocks'];
  let xmlDoc = null;
  if (window.DOMParser) {
    xmlDoc = (new DOMParser()).parseFromString(xml, 'text/xml');
  } else if (window.ActiveXObject) {
    xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = false;
    if (!xmlDoc.loadXML(xml)) {
      throw new Error(`${xmlDoc.parseError.reason} ${xmlDoc.parseError.srcText}`);
    }
  } else {
    throw new Error('cannot parse xml string!');
  }

  function isArray(o) {
    return Object.prototype.toString.apply(o) === '[object Array]';
  }

  /**
   * @param {string} xmlNode
   * @param {Array.<string>} result
   */
  function parseNode(xmlNode, result) {
    if (xmlNode.nodeName === '#text') {
      const v = xmlNode.nodeValue;
      if (v.trim()) {
        result['value'] = v;
      }
      return;
    }

    const jsonNode = {};
    const existing = result[xmlNode.nodeName];
    if (existing) {
      if (!isArray(existing)) {
        result[xmlNode.nodeName] = [existing, jsonNode];
      } else {
        result[xmlNode.nodeName].push(jsonNode);
      }
    } else if (arrayTags && arrayTags.indexOf(xmlNode.nodeName) !== -1) {
      result[xmlNode.nodeName] = [jsonNode];
    } else {
      result[xmlNode.nodeName] = jsonNode;
    }

    if (xmlNode.attributes) {
      for (let i = 0; i < xmlNode.attributes.length; i++) {
        const attribute = xmlNode.attributes[i];
        jsonNode[attribute.nodeName] = attribute.nodeValue;
      }
    }

    for (let i = 0; i < xmlNode.childNodes.length; i++) {
      parseNode(xmlNode.childNodes[i], jsonNode);
    }
  }

  const result = {};
  if (xmlDoc.childNodes.length) {
    parseNode(xmlDoc.childNodes[0], result);
  }

  return transformed(result);
}

function transformed(result) {
  const filteredResult = [];
  const xml = result["xml"];
  const categories = xml["category"];
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const cNew = {};
    cNew.name = c.name;
    cNew.colour = c.colour;
    cNew.custom = c.custom;
    cNew.blocks = [];
    const blocks = c.block;
    if (blocks) {
      for (let j = 0; j < blocks.length; j++) {
        const b = blocks[j];
        const bNew = {};
        bNew.type = b.type;
        bNew.fields = {};
        const fields = b.field;
        if (fields) {
          for (let k = 0; k < fields.length; k++) {
            const f = fields[k];
            bNew.fields[k] = f;
          }
        }
        cNew.blocks[j] = bNew;
      }
    }
    filteredResult.push(cNew);
  }
  return filteredResult;
}
