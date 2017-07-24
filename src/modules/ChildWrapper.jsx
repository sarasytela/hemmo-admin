import React from 'react';
import { connect } from 'react-redux';
import { goBack, push } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import { LinearProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';

import PageHeader from '../components/PageHeader';
import ChildDetails from '../components/ChildDetails';
import FeedbackDetails from '../components/FeedbackDetails';
import FeedbackOverview from '../components/FeedbackOverview';
import rest from '../utils/rest';
import NotFound from './NotFound';

const mapStateToProps = state => ({
  child: state.child,
  childLoading: state.child.loading,
  employees: state.employees,
  feedback: state.feedbackDetail,
  moods: state.feedbackMoods,
});

const mapDispatchToProps = dispatch => ({
  refresh: childId => {
    dispatch(rest.actions.child.get({ childId: childId }));
  },
  update: (childId, data) => {
    dispatch(
      rest.actions.child.patch(
        { childId: childId },
        { body: JSON.stringify(data) },
      ),
    );
  },
  delete: childId => {
    dispatch(
      rest.actions.child.delete({ childId: childId }, () => {
        dispatch(goBack());
      }),
    );
  },
  getEmployees: () => {
    dispatch(rest.actions.employees());
  },
  deleteFeedback: (childId, feedbackId) => {
    dispatch(
      rest.actions.feedbackDetail.delete({ feedbackId: feedbackId }, () => {
        dispatch(push(`/children/${childId}`));
      }),
    );
  },
  updateFeedback: (feedbackId, data) => {
    dispatch(
      rest.actions.feedbackDetail.patch(
        { feedbackId: feedbackId },
        { body: JSON.stringify(data) },
      ),
    );
  },
  getFeedback: params => {
    dispatch(rest.actions.feedback(params));
  },
  getMoods: params => {
    dispatch(rest.actions.feedbackMoods(params));
  },
  openFeedback: (childId, feedbackId) => {
    const path = `/children/${childId}/feedback/${feedbackId}`;
    dispatch(push(path));
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ChildWrapper extends React.Component {
  componentWillMount() {
    this.props.getEmployees();

    if (this.props.match.params.feedbackId) {
      this.props.getFeedback(this.props.match.params.feedbackId);
    }
  }

  componentDidMount() {
    const { refresh } = this.props;

    refresh(this.props.match.params.childId);
  }

  renderProgressBar() {
    const { childLoading } = this.props;

    return childLoading
      ? <div style={{ marginBottom: '-5px' }}>
          <LinearProgress />
        </div>
      : null;
  }

  render() {
    const { feedback, moods, child, childLoading } = this.props;
    const basicDetails = (
      <Grid item xs={12} sm={6}>
        <ChildDetails
          child={this.props.child.data}
          employees={this.props.employees}
          onUpdate={this.props.update.bind(this)}
          onDelete={this.props.delete.bind(this)}
        />
      </Grid>
    );

    const trend = (
      <Grid item xs={12} sm={6}>
        <FeedbackOverview
          childId={this.props.match.params.childId}
          feedback={feedback}
          moods={moods}
          refreshMoods={this.props.getMoods}
          refreshFeedback={this.props.getFeedback}
          openFeedback={this.props.openFeedback}
        />
      </Grid>
    );

    const activeFeedback = <Grid item xs={12} sm={12} />;

    const renderWrapper = (
      <div>
        <PageHeader header={child.data.name} />

        <Grid container gutter={24}>
          {basicDetails}
          {trend}
          {activeFeedback}
        </Grid>
      </div>
    );

    return (
      <div>
        {childLoading
          ? this.renderProgressBar()
          : child.data && child.data.id
            ? <div className="child-profile">
                <PageHeader header={child.data.name} />

                <Grid container gutter={24}>
                  <Grid item xs={12} sm={6}>
                    <ChildDetails
                      child={this.props.child.data}
                      employees={this.props.employees}
                      onUpdate={this.props.update.bind(this)}
                      onDelete={this.props.delete.bind(this)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    Placeholder for Trend
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <FeedbackDetails
                      childId={child.data.id}
                      data={feedback.data}
                      employees={this.props.employees}
                      onUpdate={this.props.updateFeedback.bind(this)}
                      onDelete={this.props.deleteFeedback.bind(this)}
                    />
                  </Grid>
                </Grid>
              </div>
            : <NotFound />}
          : child.data && child.data.id ? renderWrapper : <NotFound />}
      </div>
    );
  }
}