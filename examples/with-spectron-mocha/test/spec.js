const path = require('path');
const assert = require('assert');
const electronPath = require('electron');
const Application = require('spectron').Application;

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '..'), '8888'],
    chromeDriverArgs: [`user-data-dir=${path.join(__dirname, '../.test.tmp')}`],
});

const TIMEOUT = 5000;

describe('With Spectron Mocha', function() {
    this.timeout(TIMEOUT);

    before(async function() {
        this.timeout(TIMEOUT);
        await app.start();
    });

    it('Should have a visible window', async function() {
        this.timeout(TIMEOUT);
        await app.client.waitUntilWindowLoaded(TIMEOUT);
        const isVisible = await app.browserWindow.isVisible();
        assert.strictEqual(isVisible, true);
    });

    after(async function() {
        this.timeout(TIMEOUT);
        await app.stop();
    });
});
