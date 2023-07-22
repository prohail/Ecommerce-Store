import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const ContactUs = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <img
            src="https://images.pexels.com/photos/11285337/pexels-photo-11285337.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Contact Us"
            className="img-fluid w-100"
          />
        </Col>

        <Col md={6}>
          <Form>
            <br />
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <br />
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <br />
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" placeholder="Enter your phone number" />
            </Form.Group>
            <br />
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your message"
              />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
