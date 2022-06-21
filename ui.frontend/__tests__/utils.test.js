import readData from "../src/utils";

test('readData test', () => {
    let element = {
        dataset: {
            "cmpIs" : "datepicker",
            "cmpFormcontainer": "/apps/mysite/container"
        }
    }
    let expected = {
        formcontainer: element.dataset.cmpFormcontainer
    }
    let result = readData(element, "cmp");
    expect(result.formcontainer).toBe(expected.formcontainer);
});