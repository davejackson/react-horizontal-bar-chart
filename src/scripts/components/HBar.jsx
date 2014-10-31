/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
require('../../styles/HBar.css');
require('d3')

var Bar = React.createClass({
  getDefaultProps: function() {
    return {
      width: 0,
      height: 0,
      offset: 0
    }
  },

  render: function() {
    return (
      <rect
        className={this.props.focused ? 'focused' : ''}
        width={this.props.width} height={this.props.height}
        y={this.props.offset} x={0}
        onMouseOver={this.props.over}
        onMouseOut={this.props.out}
      />
    );
  }
});

var HBar = React.createClass({
  getDefaultProps: function() {
    return {
      width: 230,
      height: 300,
      data: [
        {v: 30, label: 'Salut'},
        {v: 10, label: 'Mon'},
        {v: 5, label: 'Pote'}
      ]
    }
  },

  getInitialState: function(){
    return {
      focus: this.props.focus
    }
  },

  render: function() {
    var props = this.props;
    var hbar = this


    hbar.scales()

    var data = this.props.data;

    if (this.props.sort === 'ascending') data.sort(function(p, q){return p.v > q.v});
    if (this.props.sort === 'descending') data.sort(function(p, q){return p.v < q.v});

    var bars = data.map(function(point, i) {
      return (
        <Bar  key={i}
              width={hbar.xScale(point.v)} height={hbar.yScale.rangeBand()}
              offset={hbar.yScale(i)}
              over={hbar.over.bind(hbar, i)}
              out={hbar.out}
              focused={hbar.state.focus == i}
        />
      )
    });

    return (
      <svg className="HBar" width={this.props.width} height={this.props.height}>
        <g>{bars}</g>
        <line className="axis"
              x1="0" y1="0" x2="0" y2={this.yScale.rangeExtent()[1]}
              style={{
                strokeWidth: (this.props.width * 0.005) + 'px',
                visibility: this.props.axis ? 'visible' : 'hidden'
              }}
        />
        {this.focus()}
      </svg>

    );
  },

  focus: function(){
    if (this.state.focus == undefined) return;

    var i = this.state.focus,
        point = this.props.data[i];

    var x = this.xScale(point.v),
        y = this.yScale(i) + this.yScale.rangeBand() / 2

    var wide = x > this.props.width / 2 //the bar is wide, the point label will go inside

    var margin = this.props.width * 0.03
    var style = {fontSize: this.yScale.rangeBand() * 0.6 + 'px'}

    return (
      <g className="focus" style={style}>
        <text className="inside"
              y={y}
              x={x - margin}
              textAnchor="end"
        >
          {wide ? point.label : ''}
        </text>
        <text className="outside"
              y={y}
              x={x + margin}
              textAnchor="start"
        >
          {wide ? point.v : point.label + ', ' + point.v}
        </text>
      </g>
    )
  },

  over: function(i){
    this.setState({
      focus: i
    })
  },

  out: function(){
    this.setState({
      focus: null
    })
  },

  scales: function(){
    var w = this.props.width
    this.xScale = d3.scale.linear()
      .domain([0, d3.max(this.props.data, function(p){return p.v})])
      // leave some space in the container to displat bar values
      .range([0, w * 0.8]);

    this.yScale = d3.scale.ordinal()
      .domain(d3.range(this.props.data.length))
      .rangeBands([0, this.props.height], 1/3, 1/2);
  }


});

module.exports = HBar;
