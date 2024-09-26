import React, { useEffect, useState } from 'react';
import { Container, Accordion, Row, Col } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import axios from 'axios';
import moment from 'moment';

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const Recruitment = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_HOST}/api/recruitments`)
            .then(response => {
                // Filter Active === True 
                const activeJobs = response.data.data.filter(job => job.attributes.Active);
                setJobs(activeJobs);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
            });
    }, []);

    const calculateTimeAgo = (publishedDate) => {
        return moment(publishedDate).fromNow();
    };

    return (
        <Container>
            <h1 className="text-center my-4">招聘信息</h1>

            {/* If no job is actively recuiting */}
            {jobs.length === 0 ? (
                <p className="text-center">当前暂无招聘信息，请持续关注我们的新动态。</p>
            ) : (
                <Accordion>
                    {jobs.map((job, index) => (
                        <Accordion.Item eventKey={index.toString()} key={job.id}>
                            <Accordion.Header>
                                <div style={{ flex: 1 }}>
                                    <div className="fw-bold" style={{ fontSize:20 }}>{job.attributes.Job_Title_zh}</div> <br />
                                    <div>
                                        {/* Second row：Type & Participation */}
                                        <Row>
                                            <Col>
                                                <strong>类型：</strong>{' '}
                                                {job.attributes.Type}
                                            </Col>
                                            <Col>
                                                <strong>参与方式：</strong>{' '}
                                                {job.attributes.Participation}
                                            </Col>
                                        </Row>
                                        {/* Third row：Location */}
                                        <Row className="mt-2">
                                            <Col>
                                                <strong>工作地点：</strong>{' '}
                                                {job.attributes.Location}
                                            </Col>
                                            <Col className="text-end">
                                                <small>
                                                    {calculateTimeAgo(job.attributes.Published)}
                                                </small>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>

                            </Accordion.Header>
                            <Accordion.Body>
                                {/* OnShow：Intro */}
                                <strong>职位介绍：</strong>
                                <ReactMarkdown>{job.attributes.Intro_zh}</ReactMarkdown>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
            <br />
        </Container>
    );
};

export default Recruitment;
