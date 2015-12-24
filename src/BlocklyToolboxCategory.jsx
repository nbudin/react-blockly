import React from 'react';

import BlocklyToolboxBlock from './BlocklyToolboxBlock';

var BlocklyToolboxCategory = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    custom: React.PropTypes.string,
    categories: React.PropTypes.array,
    blocks: React.PropTypes.array
  },

  componentDidMount: function() {
    if (this.props.custom) {
      ReactDOM.findDOMNode(this.refs.category).setAttribute('custom', this.props.custom);
    }
  },

  render: function() {
    var subcategories = (this.props.categories || []).map(function(subcategory, i) {
      return <BlocklyToolboxCategory
        name={subcategory.name}
        custom={subcategory.custom}
        key={"category_" + subcategory.name + "_" + i}
        blocks={subcategory.blocks}
        categories={subcategory.categories} />;
    }.bind(this));

    var blocks = (this.props.blocks || []).map(function(block, i) {
      return (
        <BlocklyToolboxBlock
          type={block.type}
          key={"block_" + block.type + "_" + i}
          fields={block.fields}
          values={block.values}
          mutation={block.mutation}
          shadow={block.shadow}
          next={block.next} />
      );
    });

    return (
      <category name={this.props.name} ref="category">
        {blocks}
        {subcategories}
      </category>
    );
  }
});

export default BlocklyToolboxCategory;