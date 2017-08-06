import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import { Link } from 'react-router';
import { converter } from '../constants/constants';
import Icon from './lib/icon/icon';
import Calendar from '../../../../static/svg/calendar2.svg';
import Course from '../../../../static/svg/course.svg';
import Users from '../../../../static/svg/users.svg';

// CSS3 animation helper to cleanup classes after animationd ends
$.fn.extend({
  animateCss(animationName, callback) {
    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(this).addClass(`animated ${animationName}`).one(animationEnd, () => {
      $(this).removeClass(`animated ${animationName}`);
      if (callback) {
        callback();
      }
    });
  }
});

// String capitalization
String.prototype.capitalize = () => (this ? this.charAt(0).toUpperCase() + this.slice(1) : null);

// Common app methods
module.exports = {

  renderCards: (type, props) => {
    let newList = [];
    const path = type;

    if (type === 'blog') {
      type = 'posts';
    }

    newList = Object.keys(props[type]).map((key) => {
      const item = props[type][key];
      const date = (type === 'courses')
          ? item.startDate
          : item.date;

      if (item && item.status && item.status !== 'inactive') {
        return (<li key={key} ref={`item-${key}`} className={`card ${type}-card`}>
          <Link to={`/${path}/${item.slug}`}>{item.featuredImage
              ? <div
                className="card-thumb card-image" style={{
                  backgroundImage: `url(${props.files[item.featuredImage].url})`
                }}
              />
              : <div className="card-thumb">
                <span>{item.code}</span>
              </div>}</Link>
          <div className="card-wrapper clearfix">
            <h3 className="card-title">
              <Link to={`/${path}/${item.slug}`}>{item.title}</Link>
            </h3>
            <div className="card-meta">
              <p><Icon glyph={Calendar} />{(type === 'courses')
                  ? 'Starts '
                  : ''}
                <span className="card-date">{item.startDate || item.date
                    ? moment(date).format('D/M/YYYY')
                    : 'anytime'}</span>
                {(type === 'courses' && item.level)
                  ? <span><Icon glyph={Course} />{props.levels[item.level].code}</span>
                  : ''}
              </p>
            </div>
            <div
              className="card-content" dangerouslySetInnerHTML={{
                __html: converter.makeHtml(item.content1)
              }}
            />
            {(type === 'posts')
              ? <div className="card-actions">
                <button className="btn btn-xs btn-secondary float-right">
                  <Link to={`/${path}/${item.slug}`}>Read more</Link>
                </button>
              </div>
              : <div className="card-info">
                <span className="card-enrolled"><Icon glyph={Users} />
                  1.5K enrolled</span>
                {item.price
                  ? <span className="card-price">{item.price}€</span>
                  : ''}
              </div>}
          </div>
        </li>);
      }
      return '';
    });

    return newList;
  },

  slugify: string =>
    string.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),

  copyTextToClipboard: (text) => {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.select();

    document.body.removeChild(textArea);
  },

  getAppVersion: (element) => {
    $.ajax('/static/version.json').done((response) => {
      if (response) {
        const date = new Date(response.version.buildDate);
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];
        $(element).html(`v${response.version.version} (Built on ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()})`);
      }
    });
  }
};
