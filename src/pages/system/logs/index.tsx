import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Card, Descriptions, Modal, Tag } from 'antd';
import Prism from 'prismjs';
import React, { useEffect, useRef, useState } from 'react';
import { getLogs, type OperationLog } from '@/services/log';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import styles from './index.less';

const buildTargetText = (record: OperationLog) => {
  const target = record.entityName || record.entityType || '-';
  return `${target}`;
};

const detectLanguage = (content: string): string => {
  const trimmed = content.trim();
  if (/^\s*[{[]/.test(trimmed)) return 'json';
  if (
    /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|CREATE TABLE|ALTER TABLE)\b/i.test(
      trimmed,
    )
  ) {
    return 'sql';
  }
  if (/\b(function|const|let|var|=>|class|import|export)\b/.test(trimmed)) {
    return 'javascript';
  }
  return 'plaintext';
};

const CodeBlock: React.FC<{ code: string; language?: string }> = ({
  code,
  language = 'plaintext',
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && language !== 'plaintext') {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <pre className={styles.codePre}>
      <code ref={codeRef} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};

const DetailModal: React.FC<{
  open: boolean;
  onClose: () => void;
  record: OperationLog | null;
}> = ({ open, onClose, record }) => {
  if (!record) return null;

  const formatDetails = (): { code: string; language: string } => {
    if (record.details === undefined || record.details === null) {
      return { code: '-', language: 'plaintext' };
    }
    if (typeof record.details === 'string') {
      const lang = detectLanguage(record.details);
      return { code: record.details, language: lang };
    }
    const jsonStr = JSON.stringify(record.details, null, 2);
    return { code: jsonStr, language: 'json' };
  };

  const { code, language } = formatDetails();

  return (
    <Modal
      title="操作详情"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Descriptions bordered column={1} className={styles.detailDescriptions}>
        <Descriptions.Item label="操作用户">
          {record.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="角色">
          {record.roleName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="操作类型">
          <Tag color="blue">{record.action}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="操作对象">
          {buildTargetText(record)}
        </Descriptions.Item>
        <Descriptions.Item label="操作时间">
          {record.createdAt}
        </Descriptions.Item>
        <Descriptions.Item label="IP 地址">
          {record.ip || '-'}
        </Descriptions.Item>
        <Descriptions.Item
          label="详情内容"
          styles={{ content: { padding: 0 } }}
        >
          <CodeBlock code={code} language={language} />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

const LogManagement: React.FC = () => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<OperationLog | null>(null);

  const handleViewDetail = (record: OperationLog) => {
    setCurrentRecord(record);
    setDetailModalOpen(true);
  };

  const columns: ProColumns<OperationLog>[] = [
    {
      title: '操作用户',
      dataIndex: 'name',
      width: 140,
      render: (_, record) => record.name || '-',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      search: false,
      width: 140,
    },
    {
      title: '操作对象',
      key: 'target',
      search: false,
      width: 320,
      render: (_, record) => buildTargetText(record),
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 180,
      search: false,
    },
    {
      title: '操作详情',
      key: 'details',
      search: false,
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable<OperationLog>
          rowKey="id"
          columns={columns}
          request={async (params) => {
            const res = await getLogs(params);
            return {
              data: res.data,
              success: res.success,
              total: res.total,
            };
          }}
          pagination={{ pageSize: 10 }}
          search={{ labelWidth: 'auto' }}
          options={false}
          scroll={{ x: 1200 }}
        />
      </Card>
      <DetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        record={currentRecord}
      />
    </PageContainer>
  );
};

export default LogManagement;
