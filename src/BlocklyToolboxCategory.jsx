import React from 'react';

import BlocklyToolboxBlock from './BlocklyToolboxBlock';

var BlocklyToolboxCategory = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    custom: React.PropTypes.string,
    categories: React.PropTypes.array,
    blocks: React.PropTypes.array
  },

  statics: {
    renderCategory: function(category, key) {
      if (category.type == 'sep') {
        return <sep key={key}></sep>;
      } else if (category.type == 'search') {
        return <search key={key}/>;
      } else {
        return <BlocklyToolboxCategory
          name={category.name}
          custom={category.custom}
          key={key}
          blocks={category.blocks}
          categories={category.categories} />;
      }
    }
  },

  componentDidMount: function() {
    if (this.props.custom) {
      ReactDOM.findDOMNode(this.refs.category).setAttribute('custom', this.props.custom);
    }
  },

  render: function() {
    var subcategories = (this.props.categories || []).map(BlocklyToolboxCategory.renderCategory);
    var blocks = (this.props.blocks || []).map(BlocklyToolboxBlock.renderBlock);

    return (
      <category name={this.props.name} ref="category">
        {blocks}
        {subcategories}
      </category>
    );
  }
});

export default BlocklyToolboxCategory;