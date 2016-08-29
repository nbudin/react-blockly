import React from 'react';
import { is } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import BlocklyToolboxCategory from './BlocklyToolboxCategory';
import BlocklyToolboxBlock from './BlocklyToolboxBlock';

var BlocklyToolbox = React.createClass({
  propTypes: {
    categories: ImmutablePropTypes.list,
    blocks: ImmutablePropTypes.list,
    processCategory: React.PropTypes.func,
    didUpdate: React.PropTypes.func
  },

  renderCategories: function(categories) {
    return categories.map(function(category, i) {
      if (category.get('type') === 'sep') {
        return <sep key={"sep_" + i}></sep>;
      } else if (category.get('type') === 'search') {
        return <search key={"search_" + i}/>;
      } else {
        return <BlocklyToolboxCategory
          name={category.get('name')}
          custom={category.get('custom')}
          colour={category.get('colour')}
          key={"category_" + category.get('name') + "_" + i}
          blocks={category.get('blocks')}
          categories={category.get('categories')} />;
      }
    }.bind(this));
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return !(is(nextProps.categories, this.props.categories) && is(nextProps.blocks, this.props.blocks));
  },

  componentDidMount: function() {
    this.props.didUpdate();
  },

  componentDidUpdate: function(prevProps, prevState) {
    this.props.didUpdate();
  },

  processCategory: function(category) {
    var processedCategory = category;

    if (processedCategory.has('categories')) {
      processedCategory = category.update('categories', function(subcategories) {
        return subcategories.map(this.processCategory);
      }.bind(this));
    }

    if (this.props.processCategory) {
      return this.props.processCategory(processedCategory);
    }

    return processedCategory;
  },

  render: function() {
    if (this.props.categories) {
      return (
        <xml style={{display: "none"}}>
          {this.renderCategories(this.props.categories.map(this.processCategory))}
        </xml>
      );
    } else {
      return (
        <xml style={{display: "none"}}>
          {this.props.blocks.map(BlocklyToolboxBlock.renderBlock)}
        </xml>
      );
    }
  }
});

export default BlocklyToolbox;