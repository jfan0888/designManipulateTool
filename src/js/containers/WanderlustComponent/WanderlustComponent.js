import './WanderlustComponent.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-bootstrap';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import { TopMenu, GlasswareCanvasComponent, GraphicPane, CompColorOptionPane, ColorOptionPane, TextOptionPane } from '../../components';
import { graphicEntryActions, colorEntryActions, fontEntryActions, patternEntryActions, wanderlustActions } from '../../actions';
import { MOBILE_LIMIT, BASE_PATH } from '../../constants/actionTypes';

class WanderlustComponent extends Component {
  
  static propTypes = {
    apiData: PropTypes.object.isRequired,
    wanderlust: PropTypes.object.isRequired,
    loadGraphicEntries: PropTypes.func.isRequired,
    loadColorEntries: PropTypes.func.isRequired,
    loadFontEntries: PropTypes.func.isRequired,
    loadPatternEntries: PropTypes.func.isRequired,

    selTopButton: PropTypes.func.isRequired,
    selectColor: PropTypes.func.isRequired,
    selectFont: PropTypes.func.isRequired,
    changeText: PropTypes.func.isRequired,
    selectFontColor: PropTypes.func.isRequired,

    canUndo: PropTypes.bool.isRequired,
    canRedo: PropTypes.bool.isRequired,
    onUndo: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      queryParam: this.props.location.query,
      colorList: [],
      windowWidth: window.innerWidth
    };

    // Load layout data for Glassware
    this.props.loadGraphicEntries('wanderlust');
    this.props.loadColorEntries('wanderlust');
    this.props.loadFontEntries('wanderlust');
    this.props.loadPatternEntries('wanderlust');
  }

  handleResize(e) {
    this.setState({windowWidth: window.innerWidth});
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  loadingBar() {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" role="progressbar"
        aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}> Loading ...
        </div>
      </div>
    );
  }

  render () {
    const { topMenu, topMenuActions, apiData, wanderlust, canUndo, canRedo } = this.props;
    let isFetching = apiData.graphic.isFetching || apiData.color.isFetching || apiData.font.isFetching;
    let buttonList = (this.state.windowWidth >= MOBILE_LIMIT) ? wanderlust.buttonList : wanderlust.mbButtonList;
   
    return (
      <div className = "wrapper">
        {/* Top Menu with buttons */}
        <TopMenu
          buttonList={buttonList}
          selected={wanderlust.topButton}
          topMenuOptions={{
            layout: 'A', 
            backgroundColor: wanderlust.selectedColor.colorName ? wanderlust.selectedColor.colorName:'', 
            borderColor: wanderlust.selectedColor.colorName ? wanderlust.selectedColor.colorName:'', 
            design: wanderlust.selectedDesign.name,
            canUndo: canUndo,
            canRedo: canRedo
          }}
          onGoBack={()=>this.props.onUndo}
          onGoForward={()=>this.props.onRedo}
          onClickButton={this.props.selTopButton}
        />
        {/* Main content */}
        {isFetching && this.loadingBar()}
        {!isFetching &&
          <div className="content-wrapper">
            <Row>
              { 
                this.state.windowWidth >= MOBILE_LIMIT &&
                <Col xs={12} sm={6} md={5}>
                  {/* Left panel with options */}
                  {
                    wanderlust.topButton ==='Color' && <ColorOptionPane 
                      title='Color Options (Step 1 of 4)'
                      subtitle='Choose Your Background Color' 
                      colorList={apiData.color.entries}
                      selected={wanderlust.selectedColor}
                      onChooseColor={this.props.selectColor}
                    />
                  }
                  {
                    wanderlust.topButton === 'Text' && <TextOptionPane
                      title="Text Options (Step 4 of 4)"
                      fontList={apiData.font.entries}
                      selectedFont={wanderlust.selectedFont}
                      lineCount={3}
                      value={wanderlust.enteredText}
                      onChooseFont={this.props.selectFont}
                      onChangeText={this.props.changeText}
                      colorList={[{colorName: "White", colorRGB: "rgb(255,255,255)"}, {colorName: "Black", colorRGB: "rgb(0,0,0)"}]}
                      selectedFontColor={wanderlust.selectedFontColor}
                      onChooseFontColor={this.props.selectFontColor}
                    />
                  }
                </Col>
              }
            </Row>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    apiData: state.apiData,
    wanderlust: state.wanderlust.present,

    canUndo: state.wanderlust.past.length > 0,
    canRedo: state.wanderlust.future.length > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadGraphicEntries: bindActionCreators(graphicEntryActions.loadGraphicEntries, dispatch),
    loadColorEntries: bindActionCreators(colorEntryActions.loadColorEntries, dispatch),
    loadFontEntries: bindActionCreators(fontEntryActions.loadFontEntries, dispatch),
    loadPatternEntries: bindActionCreators(patternEntryActions.loadPatternEntries, dispatch),

    selTopButton: bindActionCreators(wanderlustActions.selTopButton, dispatch),
    selectColor: bindActionCreators(wanderlustActions.selectColor, dispatch),
    selectFont: bindActionCreators(wanderlustActions.selectFont, dispatch),
    changeText: bindActionCreators(wanderlustActions.changeText, dispatch),
    selectFontColor: bindActionCreators(wanderlustActions.selectFontColor, dispatch),

    onUndo: bindActionCreators(UndoActionCreators.undo, dispatch),
    onRedo: bindActionCreators(UndoActionCreators.redo, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WanderlustComponent);