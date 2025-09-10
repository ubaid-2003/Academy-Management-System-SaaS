"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Typography, 
  Space, 
  Progress, 
  Timeline, 
  Avatar, 
  Badge, 
  Divider,
  Tag,
  List,
  Tooltip,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  UserAddOutlined, 
  BookOutlined, 
  BarChartOutlined, 
  SoundOutlined, 
  SettingOutlined,
  ClockCircleOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  GlobalOutlined,
  TeamOutlined,
  StarOutlined,
  DashboardOutlined,
  RiseOutlined,
  EyeOutlined
} from '@ant-design/icons';

import DashboardLayout from "../../components/DashboardLayout";
import { useAcademy } from "../../context/AcademyContext";
import { useAuth } from "../../context/AuthContext";

const { Title, Text, Paragraph } = Typography;

type Academy = {
  id: number;
  name: string;
  status: "Active" | "Inactive";
};

type Stats = {
  academies: number;
  users: number;
  activeAcademies: number;
  inactiveAcademies: number;
  totalTeachers: number;
  totalStudents: number;
};

const DashboardPage = () => {
  const router = useRouter();
  const { user, fetchWithAuth } = useAuth();
  const { academies, currentAcademy } = useAcademy();

  const [stats, setStats] = useState<Stats>({
    academies: 0,
    users: 0,
    activeAcademies: 0,
    inactiveAcademies: 0,
    totalTeachers: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.token || !currentAcademy) return;

      try {
        const active = academies.filter((a) => a.status === "Active").length;
        const inactive = academies.filter((a) => a.status === "Inactive").length;

        let totalTeachers = 0;
        let totalStudents = 0;

        try {
          const [teachersRes, studentsRes] = await Promise.all([
            fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/academies/${currentAcademy.id}/teachers`),
            fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/academies/${currentAcademy.id}/students`)
          ]);

          const teachersData = await teachersRes.json();
          const studentsData = await studentsRes.json();

          totalTeachers = Array.isArray(teachersData) ? teachersData.length : 0;
          totalStudents = Array.isArray(studentsData) ? studentsData.length : 0;
        } catch {
          totalTeachers = 0;
          totalStudents = 0;
        }

        setStats({
          academies: academies.length,
          users: 1,
          activeAcademies: active,
          inactiveAcademies: inactive,
          totalTeachers,
          totalStudents,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setStats({
          academies: 0,
          users: 1,
          activeAcademies: 0,
          inactiveAcademies: 0,
          totalTeachers: 0,
          totalStudents: 0,
        });
      }
    };

    fetchStats();
  }, [user?.token, currentAcademy, academies, fetchWithAuth]);

  const quickActions = [
    { 
      name: 'Create Course', 
      icon: <BookOutlined />, 
      description: 'Add new curriculum content',
      type: 'primary' as const,
      onClick: () => console.log('Create Course')
    },
    { 
      name: 'Generate Report', 
      icon: <BarChartOutlined />, 
      description: 'Performance analytics',
      type: 'default' as const,
      onClick: () => console.log('Generate Report')
    },
    { 
      name: 'Send Announcement', 
      icon: <SoundOutlined />, 
      description: 'Notify all users',
      type: 'default' as const,
      onClick: () => console.log('Send Announcement')
    },
    { 
      name: 'Manage Roles', 
      icon: <SettingOutlined />, 
      description: 'Update permissions',
      type: 'default' as const,
      onClick: () => console.log('Manage Roles')
    }
  ];

  const recentActivities = [
    { 
      action: 'New student registered', 
      user: 'Sarah Johnson', 
      time: '10 mins ago', 
      type: 'success' as const,
      avatar: 'S'
    },
    { 
      action: 'Course completed', 
      user: 'Michael Chen', 
      time: '1 hour ago', 
      type: 'processing' as const,
      avatar: 'M'
    },
    { 
      action: 'Academy created', 
      user: 'Admin User', 
      time: '2 hours ago', 
      type: 'success' as const,
      avatar: 'A'
    },
    { 
      action: 'Payment received', 
      user: 'Robert Williams', 
      time: '5 hours ago', 
      type: 'success' as const,
      avatar: 'R'
    },
    { 
      action: 'Teacher assigned', 
      user: 'Admin User', 
      time: 'Yesterday', 
      type: 'processing' as const,
      avatar: 'A'
    }
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header Section */}
        <Card 
          style={{ 
            marginBottom: 24, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: 16
          }}
        >
          <Row align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Space size="large" align="start">
                <Avatar 
                  size={64} 
                  style={{ 
                    backgroundColor: '#ffffff20', 
                    color: '#fff',
                    fontSize: '24px'
                  }}
                  icon={<UserAddOutlined />}
                />
                <div>
                  <Title 
                    level={2} 
                    style={{ 
                      color: '#fff', 
                      margin: 0, 
                      fontWeight: 700 
                    }}
                  >
                    Smart Academy Dashboard
                  </Title>
                  <Space style={{ marginTop: 8 }}>
                    <ClockCircleOutlined style={{ color: '#ffffff80' }} />
                    <Text style={{ color: '#ffffff80', fontSize: '16px' }}>
                      Real-time Academy Management System
                    </Text>
                  </Space>
                  <Paragraph 
                    style={{ 
                      color: '#ffffff90', 
                      marginTop: 12, 
                      marginBottom: 0,
                      maxWidth: 500 
                    }}
                  >
                    Comprehensive platform providing real-time insights, seamless administration, 
                    and enhanced learning experiences across all academy locations.
                  </Paragraph>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Space size="middle" style={{ marginTop: 16 }}>
                <Button 
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  style={{
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    color: '#667eea',
                    fontWeight: 600,
                    height: 48,
                    borderRadius: 12
                  }}
                  onClick={() => router.push("/pages/academy-admin/add-academy")}
                >
                  Add Academy
                </Button>
                <Button 
                  size="large"
                  icon={<UserAddOutlined />}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: '#ffffff50',
                    color: '#fff',
                    fontWeight: 500,
                    height: 48,
                    borderRadius: 12
                  }}
                >
                  Add User
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={
                  <Space>
                    <BankOutlined style={{ color: '#1890ff' }} />
                    <span>Total Academies</span>
                  </Space>
                }
                value={stats.academies}
                prefix={<UserAddOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <Tag color="green" style={{ marginLeft: 8 }}>
                    +12%
                  </Tag>
                }
                valueStyle={{ color: '#1890ff', fontWeight: 700 }}
              />
              <Text type="secondary">Across all locations</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={
                  <Space>
                    <TeamOutlined style={{ color: '#52c41a' }} />
                    <span>Total Students</span>
                  </Space>
                }
                value={stats.totalStudents}
                prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <Tag color="green" style={{ marginLeft: 8 }}>
                    +8%
                  </Tag>
                }
                valueStyle={{ color: '#52c41a', fontWeight: 700 }}
              />
              <Text type="secondary">Enrolled across academies</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={
                  <Space>
                    <UserAddOutlined style={{ color: '#722ed1' }} />
                    <span>Total Teachers</span>
                  </Space>
                }
                value={stats.totalTeachers}
                prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <Tag color="green" style={{ marginLeft: 8 }}>
                    +5%
                  </Tag>
                }
                valueStyle={{ color: '#722ed1', fontWeight: 700 }}
              />
              <Text type="secondary">Teaching staff members</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={
                  <Space>
                    <CheckCircleOutlined style={{ color: '#13c2c2' }} />
                    <span>Active Academies</span>
                  </Space>
                }
                value={stats.activeAcademies}
                prefix={<UserAddOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <Tag color="green" style={{ marginLeft: 8 }}>
                    +3%
                  </Tag>
                }
                valueStyle={{ color: '#13c2c2', fontWeight: 700 }}
              />
              <Text type="secondary">Currently operational</Text>
            </Card>
          </Col>
        </Row>

        {/* Main Content Grid */}
        <Row gutter={[24, 24]}>
          {/* Quick Actions */}
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Space>
                  <DashboardOutlined style={{ color: '#1890ff' }} />
                  <span>Quick Actions</span>
                </Space>
              }
              extra={<EyeOutlined style={{ color: '#8c8c8c' }} />}
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                height: '100%'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    size="small"
                    hoverable
                    style={{
                      borderRadius: 12,
                      border: '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    bodyStyle={{ padding: '16px' }}
                    onClick={action.onClick}
                  >
                    <Space style={{ width: '100%' }} align="center">
                      <Avatar 
                        style={{ 
                          backgroundColor: action.type === 'primary' ? '#1890ff' : '#f0f2f5',
                          color: action.type === 'primary' ? '#fff' : '#1890ff'
                        }}
                        icon={action.icon}
                      />
                      <div style={{ flex: 1 }}>
                        <Text strong>{action.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {action.description}
                        </Text>
                      </div>
                      <Button type="text" icon={<ArrowUpOutlined />} />
                    </Space>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>

          {/* Recent Activity */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <ClockCircleOutlined style={{ color: '#52c41a' }} />
                  <span>Recent Activity</span>
                </Space>
              }
              extra={<CalendarOutlined style={{ color: '#8c8c8c' }} />}
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                height: '100%'
              }}
            >
              <List
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item style={{ padding: '12px 0', border: 'none' }}>
                    <List.Item.Meta
                      avatar={
                        <Badge status={item.type} offset={[-5, 5]}>
                          <Avatar 
                            style={{ 
                              backgroundColor: item.type === 'success' ? '#52c41a' : '#1890ff' 
                            }}
                          >
                            {item.avatar}
                          </Avatar>
                        </Badge>
                      }
                      title={
                        <Text strong style={{ fontSize: '14px' }}>
                          {item.action}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">by {item.user}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined /> {item.time}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Performance Metrics */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#722ed1' }} />
                  <span>Performance Metrics</span>
                </Space>
              }
              extra={<StarOutlined style={{ color: '#8c8c8c' }} />}
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                height: '100%'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Student Enrollment</Text>
                    <Text strong>78%</Text>
                  </div>
                  <Progress 
                    percent={78} 
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                    showInfo={false}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Course Completion</Text>
                    <Text strong>92%</Text>
                  </div>
                  <Progress 
                    percent={92} 
                    strokeColor="#52c41a"
                    showInfo={false}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Resource Utilization</Text>
                    <Text strong>65%</Text>
                  </div>
                  <Progress 
                    percent={65} 
                    strokeColor="#722ed1"
                    showInfo={false}
                  />
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <Alert
                  message={
                    <Space>
                      <UserAddOutlined />
                      <Text strong>Overall Performance: +12.5%</Text>
                    </Space>
                  }
                  type="success"
                  showIcon={false}
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Additional Analytics */}
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <GlobalOutlined style={{ color: '#13c2c2' }} />
                  <span>Academy Distribution</span>
                </Space>
              }
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  width: 120, 
                  height: 120, 
                  border: '8px solid #f0f0f0',
                  borderTop: '8px solid #1890ff',
                  borderRadius: '50%',
                  animation: 'spin 2s linear infinite'
                }} />
                <Text type="secondary" style={{ marginTop: 24, textAlign: 'center' }}>
                  Interactive geographic visualization
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Advanced analytics coming soon
                  </Text>
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <TeamOutlined style={{ color: '#fa8c16' }} />
                  <span>User Engagement</span>
                </Space>
              }
              style={{ 
                borderRadius: 16, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Active Users</Text>
                    <Text strong>72%</Text>
                  </div>
                  <Progress percent={72} strokeColor="#1890ff" showInfo={false} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>New Users</Text>
                    <Text strong>28%</Text>
                  </div>
                  <Progress percent={28} strokeColor="#52c41a" showInfo={false} />
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <Row gutter={16}>
                  <Col span={12}>
                    <Card 
                      size="small" 
                      style={{ 
                        textAlign: 'center', 
                        backgroundColor: '#e6f7ff',
                        border: 'none',
                        borderRadius: 8
                      }}
                    >
                      <Statistic
                        value={2400}
                        valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                        suffix="k"
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Daily Active
                      </Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card 
                      size="small" 
                      style={{ 
                        textAlign: 'center', 
                        backgroundColor: '#f6ffed',
                        border: 'none',
                        borderRadius: 8
                      }}
                    >
                      <Statistic
                        value={89}
                        valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                        suffix="%"
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Retention Rate
                      </Text>
                    </Card>
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default DashboardPage;