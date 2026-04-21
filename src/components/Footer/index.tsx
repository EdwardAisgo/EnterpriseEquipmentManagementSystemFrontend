import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import styles from './index.less';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      className={styles.footer}
      copyright="Powered by XuXing"
      links={[
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined /> Xuxing
            </>
          ),
          href: 'https://github.com/EdwardAisgo',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
