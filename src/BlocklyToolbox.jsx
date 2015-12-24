import React from 'react';

import BlocklyToolboxCategory from './BlocklyToolboxCategory';

var BlocklyToolbox = React.createClass({
  renderCategories: function(categories) {
    return categories.map(function(category, i) {
      if (category.type == 'sep') {
        return <sep key={"sep_" + i}></sep>;
      } else if (category.type == 'search') {
        return <search key={"search_" + i}/>;
      } else {
        return <BlocklyToolboxCategory
          name={category.name}
          custom={category.custom}
          key={"category_" + category.name + "_" + i}
          blocks={category.blocks}
          categories={category.categories} />;
      }
    }.bind(this));
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
    return (
      <xml style={{display: "none"}}>
        {this.renderCategories(this.props.categories.map(this.processCategory))}
      </xml>
    );
  }
});

export default BlocklyToolbox;