import React from 'react';
import PropTypes from 'prop-types';
import { is } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import BlocklyToolboxCategory from './BlocklyToolboxCategory';
import BlocklyToolboxBlock from './BlocklyToolboxBlock';

class BlocklyToolbox extends React.Component {
  static propTypes = {
    categories: ImmutablePropTypes.list,
    blocks: ImmutablePropTypes.list,
    processCategory: PropTypes.func,
    didUpdate: PropTypes.func
  };

  renderCategories = (categories) => {
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
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return !(is(nextProps.categories, this.props.categories) && is(nextProps.blocks, this.props.blocks));
  }

  componentDidMount = () => {
    this.props.didUpdate();
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.props.didUpdate();
  }

  processCategory = (category) => {
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
  }

  render = () => {
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
}

export default BlocklyToolbox;
