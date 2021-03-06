import React, { Component } from 'react';
import { render } from 'react-dom';
import React from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';
import markdownTable from 'markdown-table';
import Remarkable from "remarkable";
import './style.css';

const initialColmuns = 15;
const initialRows = 6;
const getInitialData = () => [
  ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
  ['2017', 10, 23, 12, 13, 15, 16],
  ['2018', 10, 23, 12, 13, 15, 16],
  ['2019', 10, 11, 12, 13, 15, 16],
  ['2020', 10, 77, 12, 13, 15, 16],
  ['2021', 10, 11, 12, 13, 15, 16]
]

const editorOptions = {
  mode: "gfm",
  theme: 'material',
  lineNumbers: true,
};

const get2DArray = (rows, columns, initial = '') => {
  return JSON.parse(JSON.stringify((new Array(rows)).fill((new Array(columns)).fill(initial))))
}

const Line = () => (<div style={{ marginTop: '2rem', width: '100%', borderBottom: '1px solid #999' }} />)

class App extends Component {
  constructor(props) {
    super(props);
    this.table = null;
    this.code = null;
    this.state = {
      columns: initialColmuns,
      rows: initialRows,
      preview: 'md',
      markdown: ''
    };
  }

  componentDidMount() {
    const self = this;
    this.hot = new Handsontable(this.table, {
      stretchH: 'all',
      columns: [...Array(self.state.columns)],
      data: get2DArray(self.state.rows, self.state.columns),
      afterChange(changes, source) {
        if (source === 'code' || !changes) return;
        const sourceDataArray = self.hot.getSourceDataArray();
        self.setState({ markdown: markdownTable(sourceDataArray) })
      },
      licenseKey: 'non-commercial-and-evaluation'
    });
    this.setState({ markdown: markdownTable(this.hot.getSourceDataArray()) })
  }

  getRawMarkup() {
    var md = new Remarkable();
    return { __html: md.render(this.state.markdown) };
  }
  handleTableSetting(input, e) {
    const value = Number(e.target.value);
    if (value < 1) return;
    const columns = input === 'columns' ? value : this.state.columns;
    const rows = input === 'rows' ? value : this.state.rows;
    this.hot.updateSettings({
      columns: [...Array(columns)],
      data: get2DArray(rows, columns)
    })
    this.forceUpdate(() => {
      const sourceDataArray = this.hot.getSourceDataArray();
      this.setState({ [input]: value, markdown: markdownTable(sourceDataArray) })
    });
  }

  handlePreview(e) {
    this.setState({ preview: e.target.value })
  }

  loadSampleData() {
    this.setState({
      columns: initialColmuns,
      rows: initialRows,
    })
    this.hot.updateSettings({
      columns: [...Array(initialColmuns)],
      data: getInitialData()
    })
    const sourceDataArray = this.hot.getSourceDataArray();
    this.setState({ markdown: markdownTable(getInitialData()) })

  }

  render() {
    const { columns, rows, preview, markdown } = this.state;
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <h1>Tabel 😆</h1>
          
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ borderBottom: '1px solid' }}>Click right button. </span>
          <span >👉</span>
          <button onClick={this.loadSampleData.bind(this)}>Load Sample Data</button>
        </div>

        <Line />
        <p>😆 som Excel!</p>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="columns">Søjler: </label>
            <input onChange={this.handleTableSetting.bind(this, 'columns')} id="columns" value={columns} type="number" />
          </div>
          <span>x</span>
          <div>
            <label htmlFor="rows">Rækker: </label>
            <input onChange={this.handleTableSetting.bind(this, 'rows')} id="rows" value={rows} type="number" />
          </div>
        </div>
        <div ref={(node) => { this.table = node; }} />
        <Line />
        <p>😁Preview</p>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="preview-md">MarkDown tabel</label>
            <input id="preview-md" checked={preview === 'md'} onChange={this.handlePreview.bind(this)} type="radio" value="md" />
          </div>
          <span>/</span>
          <div>
            <label htmlFor="preview-html">HTML tabel</label>
            <input id="preview-html" checked={preview === 'html'} onChange={this.handlePreview.bind(this)} type="radio" value="html" />
            
          </div>
        </div>
        {preview === 'md' ? (<CodeMirror
          value={markdown}
          options={editorOptions}
        />
        ) : (<div
          className="preview"
          dangerouslySetInnerHTML={this.getRawMarkup()}
        />
        )}
        <div>test</div>
        
          <div
          className="preview"
          dangerouslySetInnerHTML={this.getRawMarkup()}
          />

      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
