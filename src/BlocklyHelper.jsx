/**
 * @param {string} xml
 */
export default function parseWorkspaceXml(xml) {
  const arrayTags = ['name', 'custom', 'colour', 'categories', 'blocks', 'button'];
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
        result.value = v;
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
  const { xml } = result;
  const categories = xml.category;
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const cNew = {};
    cNew.name = c.name;
    cNew.colour = c.colour;
    cNew.custom = c.custom;
    cNew.button = c.button;
    if (c.block) {
      cNew.blocks = parseBlocks(c.block);
    }
    filteredResult.push(cNew);
  }

  return filteredResult;
}

function parseBlocks(blocks) {
  const arr = ensureArray(blocks);

  const res = [];
  arr.forEach((block) => {
    const obj = parseObject(block);
    obj.type = block.type;
    res.push(obj);
  });

  return res;
}

function parseFields(fields) {
  const arr = ensureArray(fields);

  const res = {};
  arr.forEach((field) => {
    res[field.name] = field.value;
  });

  return res;
}

function parseValues(values) {
  const arr = ensureArray(values);

  const res = {};
  arr.forEach((value) => {
    res[value.name] = parseObject(value);
  });

  return res;
}

function ensureArray(obj) {
  if (obj instanceof Array) {
    return obj;
  }

  return [obj];
}

function parseObject(obj) {
  let res = {};
  if (obj.shadow) {
    res = parseObject(obj.shadow);
    res.type = obj.shadow.type;
    res.shadow = true;
  } else if (obj.block) {
    res = parseObject(obj.block);
    res.type = obj.block.type;
    res.shadow = false;
  }

  if (obj.mutation) {
    res.mutation = {
      attributes: obj.mutation,
      innerContent: obj.mutation.value,
    };
  }
  if (obj.field) {
    res.fields = parseFields(obj.field);
  }
  if (obj.value) {
    res.values = parseValues(obj.value);
  }
  if (obj.next) {
    res.next = parseObject(obj.next);
  }
  if (obj.statement) {
    res.statements = {
      [obj.statement.name]: parseObject(obj.statement),
    };
  }

  return res;
}
