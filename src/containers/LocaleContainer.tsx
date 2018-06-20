import * as React from 'react';
import { connect } from 'react-redux';
import { LocaleProvider } from 'antd';
import { IntlProvider, addLocaleData } from 'react-intl';

import { Locale } from 'antd/lib/locale-provider';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
import en_US from 'antd/lib/locale-provider/en_US';

import * as enLocaleData from 'react-intl/locale-data/en';
import * as zhLocaleData from 'react-intl/locale-data/zh';

import { RootState } from '@/store/ducks';
import localeMessages from '@/locales';

addLocaleData([...enLocaleData, ...zhLocaleData]);

interface LocaleContainerProps {
  locale: string;
  antLocale: Locale;
  messages: any;
}

const getAntLocale = (locale: string) => {
  switch (locale) {
    case 'en-US':
      return en_US;
    case 'zh-Hant':
      return zh_TW;
    default:
      return en_US;
  }
};

const getLocaleMessages = (locale: string) => {
  return localeMessages[locale.replace('-', '_')];
};

const LocaleContainer: React.SFC<LocaleContainerProps> = props => {
  return (
    <LocaleProvider locale={props.antLocale}>
      <IntlProvider locale={props.locale} messages={props.messages}>
        {props.children}
      </IntlProvider>
    </LocaleProvider>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    locale: state.intl.locale,
    antLocale: getAntLocale(state.intl.locale),
    messages: getLocaleMessages(state.intl.locale)
  };
};

export default connect<LocaleContainerProps>(mapStateToProps)(LocaleContainer);
