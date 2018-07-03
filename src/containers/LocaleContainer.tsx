import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { LocaleProvider } from 'antd';
import { IntlProvider, addLocaleData } from 'react-intl';

import { Locale } from 'antd/lib/locale-provider';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
import en_US from 'antd/lib/locale-provider/en_US';

import * as enLocaleData from 'react-intl/locale-data/en';
import * as zhLocaleData from 'react-intl/locale-data/zh';

import { RootState, RootAction } from '@/store/ducks';
import { intlActions, intlModels } from '@/store/ducks/intl';
import localeMessages from '@/locales';

addLocaleData([...enLocaleData, ...zhLocaleData]);

interface LocaleContainerProps {
  locale: string;
  antLocale: Locale;
  messages: any;
  updateLocaleOptions: (options: Array<intlModels.IntlOption>) => any;
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

const options = [
  {
    code: 'en-US',
    displayName: 'English',
    abbr: 'EN'
  },
  {
    code: 'zh-Hant',
    displayName: '繁體中文',
    abbr: '繁'
  }
];

class LocaleContainer extends React.PureComponent<
  LocaleContainerProps,
  object
> {
  constructor(props: LocaleContainerProps) {
    super(props);
    props.updateLocaleOptions(options);
  }

  public render() {
    const { props } = this;
    return (
      <LocaleProvider locale={props.antLocale}>
        <IntlProvider locale={props.locale} messages={props.messages}>
          {props.children}
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    locale: state.intl.locale,
    // The shape of Locale and data is not consistent
    antLocale: getAntLocale(state.intl.locale) as Locale,
    messages: getLocaleMessages(state.intl.locale)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  updateLocaleOptions: (newOptions: Array<intlModels.IntlOption>) =>
    dispatch(intlActions.updateLocaleOptions({ options: newOptions }))
});

export default connect(mapStateToProps, mapDispatchToProps)(LocaleContainer);
