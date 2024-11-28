const {JSONPath} = require('jsonpath-plus');

export function extendWithParentData({urlList, SiteData}, path) {
    const NodeData = SiteData;
    const pathArray = path.split('.');
    let finalData = {};
    let pathString = '';
    let tempPathString = '';

    for (let i = 0; i < pathArray.length; i++) {
        pathString += i === 0 ? pathArray[i] : '.' + pathArray[i];

        if (pathArray[i] !== 'children') {
            let objData = JSONPath(pathString, NodeData)[0]

            // check if we have children in object
            // and if child has url in urlList -> fill childrenUrls with [child key]:child url
            if (objData && objData.children && !(Object.entries(objData.children).length === 0 && objData.children.constructor === Object)) {
                for (let [key, value] of Object.entries(objData.children)) {
                    tempPathString = pathString + '.children.' + key;

                    for (let j = 0; j < urlList.length; j++) {
                        if (tempPathString === urlList[j].Jpath) {
                            objData.children[key].url = urlList[j].url

                            break;
                        }
                    }
                    tempPathString = '';
                }
            }

            Object.assign(finalData, objData);
        }
    }

    return finalData
}

export function getByPath(umbracoData, path) {
    return extendWithParentData(umbracoData, path);
}

export function getByContentType(umbracoData, contentType) {
    const hasChildren = (umbracoData.SiteData !== undefined || true) && (umbracoData.SiteData.children !== undefined || null)

    return hasChildren
      ? Object.values(umbracoData.SiteData.children).filter(item => item.ContentType === contentType)
      : []
}
