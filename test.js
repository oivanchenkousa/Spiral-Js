const axios = require('axios');
const { expect } = require('chai');
const chai = require('chai');
const chaiJsonSchema = require('chai-json-schema-ajv');
chai.use(chaiJsonSchema);

describe('JSONPlaceholder API', function () {
  it('should validate json schema', async () => {
       
    const postSchema = {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        id: { type: 'number' },
        title: { type: 'string' },
        body: { type: 'string' }
      },
      required: ['userId', 'id', 'title', 'body']
    };
    
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');

    chai.expect(response.data).to.be.jsonSchema(postSchema);
  });

  it('should return a list of posts', async function () {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array');
    expect(response.data.length).to.be.greaterThan(0);
    
    const firstPost = response.data[0];
    expect(firstPost).to.have.property('userId');
    expect(firstPost).to.have.property('id');
    expect(firstPost).to.have.property('title');
    expect(firstPost).to.have.property('body');
  });

  it('should return a specific post by ID', async function () {
    const postId = 1;
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('object');
    expect(response.data).to.have.property('userId');
    expect(response.data).to.have.property('id');
    expect(response.data).to.have.property('title');
    expect(response.data).to.have.property('body');
    expect(response.data.id).to.equal(postId);
  });

  it('should return a 404 status for a non-existent post', async function () {
    const postId = 9999;
    try {
      await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    } catch (error) {
      expect(error.response.status).to.equal(404);
    }
  });

  it('should create a new post', async () => {
    const newPost = {
      userId: 100,
      title: 'New Post Title',
      body: 'This is the body of the new post.',
    };

    const createResponse  = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);

    expect(createResponse.status).to.equal(201);
    expect(createResponse.data.userId).to.equal(newPost.userId);
    expect(createResponse.data.title).to.equal(newPost.title);
    expect(createResponse.data.body).to.equal(newPost.body);

    newPostId = createResponse.data.id;

    const verifyResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${newPostId}`);
    expect(verifyResponse.status).to.equal(200);
    expect(verifyResponse.data.userId).to.equal(newPost.userId);
    expect(verifyResponse.data.title).to.equal(newPost.title);
    expect(verifyResponse.data.body).to.equal(newPost.body);
  });

  it('should update already exists post', async () => {
     
      const updatedPost = {
        title: 'Updated Post Title',
        body: 'This is the updated body of the post.',
      };

      const updateResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/1`, updatedPost);

    expect(updateResponse.status).to.equal(200);
    expect(updateResponse.data.title).to.equal(updatedPost.title);
    expect(updateResponse.data.body).to.equal(updatedPost.body);

    newPostId1 = updateResponse.data.id;

    const verifyResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/1`);

    expect(verifyResponse.status).to.equal(200);
    expect(verifyResponse.data.title).to.equal(updatedPost.title);
    expect(verifyResponse.data.body).to.equal(updatedPost.body);
  });

  it('should delete already exists post', async () => {
    const deleteResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/1`);

    expect(deleteResponse.status).to.equal(200);

    let fetchResponse;
    try {
      fetchResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/1`);
    } catch (error) {
      fetchResponse = error.response;
    }

    expect(fetchResponse.status).to.equal(404);
  });

});
