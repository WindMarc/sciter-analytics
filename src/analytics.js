/**
 * Sciter in-app analytics
 * @author 8ctopus <hello@octopuslabs.io>
 */

import * as env from "@env";
import {uuid} from "@sciter";

export class analytics
{
    static #endpoint;

    static #headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "*/*",
    };

    static #env;
    static #events = [];

    static init(url)
    {
        this.#endpoint = url;

        // add environment variables
        this.#env = {
            device: env.DEVICE,
            platform: env.PLATFORM,
            os: env.OS,
            language: env.language(),
            country: env.country(),
            userName: env.userName(),
        };
    }

    /**
     * Add environment variables
     * @param object env
     */
    static env(env)
    {
        this.#env = {
            ...this.#env,
            ...env,
        }
    }

    /**
     * Add event
     * @param string label - event label
     */
    static event(label)
    {
        this.#events.push({
            label: label,
            timestamp: new Date(),
        });
    }

    /**
     * Watch
     * @param string event
     * @param string(optional) selector
     * @param string label
     */
    static watch(event, selector, label)
    {
        if (selector !== null)
            document.on(event, selector, () => {
                this.event(label);
            });
        else
            document.on(event, () => {
                this.event(label);
            });
    }

    //const [hours, minutes, seconds] = new Date().toLocaleTimeString("en-US").split(/:| /)

    /**
     * Log environment and events
     * @return void
     */
    static log()
    {
        // log environment
        console.debug(this.#env);
        /*
        for (const key in this.#env) {
            console.debug(`${key}: ${this.#env[key]}`);
        }

        // loop through events
        this.#events.forEach(function(event) {
            // log event
            console.debug(event);
        })
        */

        // log events
        console.debug(this.#events);
    }

    /**
     * Send analytics to remote server
     * @return Promise
     */
    static async send()
    {
        const body = JSON.stringify({
            env: this.#env,
            events: this.#events,
        });

        //console.debug(body);
        //return;

        const response = await fetch(this.#endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: this.#headers,
            body: body,
        });

        console.line();
        console.log(`response status - ${response.status}`);

        const json = await response.json();

        //console.log(response.text());
        console.log(json);
    }
}
