import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  fab: {
    position: 'absolute',
    textTransform: 'none',
    marginLeft: 'calc(50% - 28px)',
    marginTop: 50,
  },
}));

export const nodeStyle = {
  'width': 'label',
  'height': 'label',
  'background-color': 'white',
  'label': 'data(label)',
  'border-style': 'solid',
  'border-width': '1',
  'border-color': 'black',
  'text-halign': 'center',
  'text-valign': 'center',
  'text-max-width': 220,
  'text-wrap': 'wrap',
  'padding': 15,
  'shape': 'rectangle',
};

export const parentEntityStyle = {
  'width': 'label',
  'height': 'label',
  'font-weight': 'bold',
  'background-opacity': 0.075,
  'padding': 30,
  'text-valign': 'top',
  'text-halign': 'center',
  'text-margin-y': 25,
};

export const edgeStyle = {
  'arrow-scale': 1,
  'target-arrow-shape': 'triangle',
  'target-arrow-color': 'black',
  'curve-style': 'bezier',
};
