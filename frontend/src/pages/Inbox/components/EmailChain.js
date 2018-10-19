import React, { Component, Fragment } from 'react';
import styled, { css } from 'react-emotion';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  markThreadAsRead,
  markThreadAsDeleted,
  setSelectedReply,
} from '../../../actions/exerciseActions';
import { getThread } from '../../../selectors/exerciseSelectors';
import { showWebpage } from '../../../actions/uiActions';
import { addFile } from '../../../actions/fileManagerActions';
import actionTypes from '../../../config/actionTypes';
import Email from './Email';
import { logAction } from '../../../utils';

const ActionLink = styled(Link)({
  marginRight: 20,
  textDecoration: 'none',
  color: '#B8B8B8',
  fontWeight: 'bold',
  letterSpacing: '1.1px',
});

function ActionLinkwithClick({
  data,
  title,
  markThreadAsDeleted,
  threadId,
  remove,
}) {
  return (
    <ActionLink
      to={
        remove
          ? {
              pathname: '/inbox',
            }
          : {}
      }
      onClick={() => {
        logAction({
          actionType: data.actionType,
          participantId: data.participantId,
          timeDelta: Date.now() - data.startTime,
          emailId: data.emailId,
          timestamp: new Date(),
        });
        remove && markThreadAsDeleted(threadId);
      }}
    >
      {title}
    </ActionLink>
  );
}

function EmailActions({ threadId, markThreadAsDeleted, onReplyParams }) {
  return (
    <div
      className={css({
        flexShrink: '0',
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '20px',
        paddingBottom: '20px',
        background: 'white',
      })}
    >
      <ActionLinkwithClick
        data={{
          ...onReplyParams,
          actionType: actionTypes.emailReply,
        }}
        title="Reply"
      />
      <ActionLinkwithClick
        data={{
          ...onReplyParams,
          actionType: actionTypes.emailForward,
        }}
        title="Forward"
      />
      <ActionLinkwithClick
        data={{
          ...onReplyParams,
          actionType: actionTypes.emailDelete,
        }}
        title="Delete"
        markThreadAsDeleted={markThreadAsDeleted}
        threadId={threadId}
        remove
      />
      <ActionLinkwithClick
        data={{
          ...onReplyParams,
          actionType: actionTypes.emailReport,
        }}
        title="Report"
        markThreadAsDeleted={markThreadAsDeleted}
        threadId={threadId}
        remove
      />
    </div>
  );
}

export class EmailChain extends Component {
  componentDidMount() {
    const { thread } = this.props;
    if (thread && !thread.idRead) {
      this.props.markThreadAsRead(thread.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { thread: oldThread } = prevProps;
    const { thread: newThread } = this.props;
    if (newThread.id !== oldThread.id && !newThread.isRead) {
      this.props.markThreadAsRead(newThread.id);
    }
  }

  render() {
    const { thread } = this.props;
    return thread ? (
      <div
        className={css({
          height: '100%',
          display: 'flex',
          boxSizing: 'border-box',
          flexDirection: 'column',
        })}
        key={thread.id}
      >
        <EmailActions
          markThreadAsDeleted={this.props.markThreadAsDeleted}
          threadId={thread.id}
          onReplyParams={{
            startTime: this.props.startTime,
            participantId: this.props.participantId,
            emailId: thread.id,
          }}
        />
        <div
          className={css({
            flexGrow: 1,
            overflowY: 'auto',
          })}
        >
          {thread.emails.map(email => (
            <Fragment key={email.id}>
              <Email
                email={email}
                threadId={thread.id}
                addFile={this.props.addFile}
                markThreadAsDeleted={this.props.markThreadAsDeleted}
                showWebpage={this.props.showWebpage}
                onReplyParams={{
                  startTime: this.props.startTime,
                  participantId: this.props.participantId,
                  emailId: email.id,
                }}
                setSelectedReply={this.props.setSelectedReply}
              />
              <hr
                className={css({
                  width: '100%',
                })}
              />
            </Fragment>
          ))}
        </div>
      </div>
    ) : (
      <Redirect to="/inbox" />
    );
  }
}

export default connect(
  (state, props) => ({
    thread: getThread(state, { threadId: props.match.params.emailId }),
    startTime: state.exercise.startTime,
    participantId: state.exercise.participant,
  }),
  {
    markThreadAsRead,
    showWebpage,
    addFile,
    markThreadAsDeleted,
    setSelectedReply,
  }
)(EmailChain);
