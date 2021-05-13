const puppeteer = require('puppeteer');
const utils = require('../../test-utils');
const init = require('../../test-init');

let browser, page;
const user = {
    email: utils.generateRandomBusinessEmail(),
    password: '1234567890',
};
const componentName = utils.generateRandomString();

/** This is a test to check:
 * No errors on page reload
 * It stays on the same page on reload
 */

describe('Fyipe Component Reload', () => {
    const operationTimeOut = init.timeout;

    beforeAll(async done => {
        jest.setTimeout(init.timeout);

        browser = await puppeteer.launch(utils.puppeteerLaunchConfig);
        page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        );

        await init.registerUser(user, page); // This automatically routes to dashboard page
        done();
    });

    afterAll(async done => {
        await browser.close();
        done();
    });

    test(
        'Should create a component and confirm there are no errors',
        async done => {
            await init.addComponent(componentName, page);
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector('#cbMonitors', { visible: true });
            done();
        },
        operationTimeOut
    );

    test(
        'Should create a component and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#incidentLog', { visible: true });
            await init.pageClick(page, '#incidentLog');
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector(`#cb${componentName}`, {
                visible: true,
            });
            await page.waitForSelector('#cbIncidents', { visible: true });
            done();
        },
        operationTimeOut
    );

    test(
        'Should navigate to Log page inside component and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#logs', { visible: true });
            await init.pageClick(page, '#logs');
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector(`#cb${componentName}`, {
                visible: true,
            });
            await page.waitForSelector('#cbLogs', { visible: true });
            done();
        },
        operationTimeOut
    );

    test(
        'Should navigate to Error tracking page inside component and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#errorTracking', { visible: true });
            await init.pageClick(page, '#errorTracking');
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector(`#cb${componentName}`, {
                visible: true,
            });
            await page.waitForSelector('#cbErrorTracking', { visible: true });
            done();
        },
        operationTimeOut
    );

    test(
        'Should navigate to Performance tracker page inside component and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#performanceTracker', {
                visible: true,
            });
            await init.pageClick(page, '#performanceTracker');
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector(`#cb${componentName}`, {
                visible: true,
            });
            await page.waitForSelector('#cbPerformanceTracker', {
                visible: true,
            });
            done();
        },
        operationTimeOut
    );

    test(
        'Should navigate to Container security page inside component and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#security', { visible: true });
            await init.pageClick(page, '#security');
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector(`#cb${componentName}`, {
                visible: true,
            });
            await page.waitForSelector('#cbContainerSecurity', {
                visible: true,
            });
            done();
        },
        operationTimeOut
    );

    test(
        'Should navigate to Application security inside component and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#security', { visible: true });
            await init.pageClick(page, '#security');
            await page.waitForSelector('#application', { visible: true });
            await init.pageClick(page, '#application');
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector(`#cb${componentName}`, {
                visible: true,
            });
            await page.waitForSelector('#cbApplicationSecurity', {
                visible: true,
            });
            done();
        },
        operationTimeOut
    );

    test(
        'Should navigate to Component-Settings(Basic) inside component and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#componentSettings', { visible: true });
            await init.pageClick(page, '#componentSettings');
            await page.waitForSelector('#basic', { visible: true });
            await init.pageClick(page, '#basic');
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector(`#cb${componentName}`, {
                visible: true,
            });
            await page.waitForSelector('#cbComponentSettings', {
                visible: true,
            });
            done();
        },
        operationTimeOut
    );

    test(
        'Should navigate to Component-Settings(Advanced) inside component and confirm there are no errors',
        async done => {
            await init.navigateToComponentDetails(componentName, page);
            await page.waitForSelector('#componentSettings', { visible: true });
            await init.pageClick(page, '#componentSettings');
            await page.waitForSelector('#advanced', { visible: true });
            await init.pageClick(page, '#advanced');
            // To confirm no errors and stays on the same page on reload
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector('#cbAdvanced', { visible: true });
            done();
        },
        operationTimeOut
    );
});
