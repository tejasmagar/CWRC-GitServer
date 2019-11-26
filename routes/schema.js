/**
 * Module providing XML/CSS SCHEMAS related routes.
 * @module routes/schema
 */

const express = require('express');
const debug = require('debug')('cwrc-server:server');
// const xmlparser = require('express-xml-bodyparser');
// const xml = require('xml');
const rpn = require('request-promise-native')

/**
 * Express router to mount schema related functions on.
 * @namespace router
 */
const router = new express.Router();
router.use(express.json());


/**
 * Custom middleware sets Access-Control-Allow headers in the response.
 * @function
 * @param {Object} req The request
 * @param {Object} res The response
 * @param {Function} next Next middleware function
 */
const httpHeaders = (request, response, next) =>  {
    response.header('Access-Control-Allow-Origin', '*'); ////true
    response.header('Access-Control-Allow-Methods', 'POST');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

router.use(httpHeaders);

/**
 * Get request from uri.
 * Calls {@ link @param url}
 * @module loadResource
 * @function
 * @param {String} url The uri to load
 */
const loadResource = async url => {

    const res = await rpn({
            url,
            resolveWithFullResponse: true,
            simple: false,
            // headers: {'Content-Type': 'text/xml'},
        })
        .catch( error =>  {
            console.log(error);
            debug(error)
            return {
                statusCode: 500
            }
        });

    return res;

}


/**
 * Get the XML Schema from a repo.
 * Calls {@ link @param url and/or @param altUrl}
 * @name post/xml
 * @function
 * @memberof module:routes/schema
 * @param {Object} req The request
 * @param {Object} req.body The object containing the schema information
 * @param {String} req.body.url The primary xml schema uri
 * @param {String} req.query.altUrl The secundary xml schema uri
 */
router.post('/xml', async (req, res) => {

    res.type('xml')

    if (req.body.url) {
        const schema = await loadResource(req.body.url);
        if (schema.statusCode === 200) {
            res.status(200).send(schema.body);
            return;
        }
        
    }


    if (req.body.altUrl) {
        const schema = await loadResource(req.body.altUrl);
        if (schema.statusCode === 200) {
            res.status(200).send(schema.body);
            return;
        }
        
    }

    //if both fail
    res.status(204).send();

})

/**
 * Get the CSS Schema from a repo.
 * Calls {@ link @param url and/or @param altUrl}
 * @name post/css
 * @function
 * @memberof module:routes/schema
 * @param {Object} req The request
 * @param {Object} req.body The object containing the schema information
 * @param {String} req.body.cssUrl The primary xml schema uri
 * @param {String} req.query.altCssUrl The secundary xml schema uri
 */
router.post('/css', async (req, res) => {

    res.type('css')

    if (req.body.cssUrl) {
        const schema = await loadResource(req.body.cssUrl);
        if (schema.statusCode === 200) {
            res.status(200).send(schema.body);
            return;
        }
        
    }

    if (req.body.altCssUrl) {
        const schema = await loadResource(req.body.altCssUrl);
        if (schema.statusCode === 200) {
            res.status(200).send(schema.body);
            return;
        }
        
    }

    //if both fail
    res.status(204).send();
    
})


module.exports = router;
