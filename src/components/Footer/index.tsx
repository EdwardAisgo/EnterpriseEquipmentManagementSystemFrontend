import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
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
