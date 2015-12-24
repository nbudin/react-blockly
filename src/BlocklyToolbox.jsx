import React from 'react';

import BlocklyToolboxCategory from './BlocklyToolboxCategory';
import BlocklyToolboxBlock from './BlocklyToolboxBlock';

var BlocklyToolbox = React.createClass({
  propTypes: {
    categories: React.PropTypes.array,
    blocks: React.PropTypes.array,
    processCategory: React.PropTypes.func,
    didUpdate: React.PropTypes.func
  },

  componentDidMount: function() {
    this.props.didUpdate();
  },

  componentDidUpdate: function(prevProps, prevState) {
    this.props.didUpdate();
  },

  processCategory: function(category) {
    var processedCategory = Object.assign({}, category);
    if (processedCategory.categories) {
      Object.assign(processedCategory, { categories: processedCategory.categories.map(this.processCategory) });
    }

    if (this.props.processCategory) {
      this.props.processCategory(processedCategory);
    }

    return processedCategory;
  },

  render: function() {
    var content;
    if (this.props.categories) {
      var processedCategories = this.props.categories.map(this.processCategory);
      content = processedCategories.map(BlocklyToolboxCategory.renderCategory);
    } else if (this.props.blocks) {
      content = this.props.blocks.map(BlocklyToolboxBlock.renderBlock);
    }

    return (
      <xml style={{display: "none"}}>
        {content}
      </xml>
    );
  }
});

export default BlocklyToolbox;